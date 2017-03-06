require 'nokogiri'
require 'set'
require 'json'
require 'pry-byebug'

# Pages that we expect to have no parent page
TOP_LEVEL_TITLES = [
  'Africa',
  'Antarctica',
  'Asia',
  'Eurasia',
  'Europe',
  'Latin America',
  'North America',
  'Oceania',
  'South America',
  'Other destinations'
]

class Page
  def initialize(node)
    @node = node
  end

  def title
    #@title ||= @node.children.find { |child| child.name == 'title' }.text.strip
    @title ||= @node.children.find { |child| child.name == 'title' }.text
  end

  def redirect
    @redirect ||= @node.children
      .find { |child| child.name == 'redirect' }
      &.attributes&.[]('title')&.value&.strip
  end

  def body
    @body ||= body_node.children.first&.text
  end

  def bad_title?
    [
      /phrasebook/i, # Hacky, but the best way I've found for IDing phrasebooks
      /^(wikivoyage|mediawiki|template|category|file|module):/i
    ].any? { |pattern| title =~ pattern }
  end

  def bad_body?
    return false if top_level?

    [
      /{{(itinerary|disamb|disambig|disambiguation|Phrasebookguide|joke|WikivoyageDoc\|policies|Title-Index page|historical|documentation|vfd)}}/i,
      /GalleryPageOf\|.*?/i,
      /{{PartOfTopic\|.*?}}/i,
    ].any? { |pattern| body =~ pattern }
  end

  def top_level?
    TOP_LEVEL_TITLES.include?(title)
  end

  def tag
    @node.name
  end

  def text
    @node.text
  end

  def parent
    body.match(/{{IsPartOf\|([^}|]*)(?:|.*?)?}}/i)&.[](1)
  end

  private

  def body_node
    @body_node ||= revision.children.find do |child|
      child.name == 'text' && child.attributes&.[]('space')&.value == 'preserve'
    end
  end

  def revision
    @revision ||= @node.children.find { |child| child.name == 'revision' }
  end
end

class PageHierarchy

  # Expects an xml filename.  The xml doc should have one child, and that child
  # should have all pages as immediate children.
  def self.from_xml_file(xml_doc)
    @whatever
    doc = File.open('enwikivoyage-latest-pages-articles.xml') { |f| Nokogiri::XML(f) }
    page_hierarchy = new(doc.children.first)
    page_hierarchy.build_map
    page_hierarchy
  end

  def build_map
    @root.children.each { |node| add_page(Page.new(node)) }
  end

  def add_page(page)
    return if page.tag == 'siteinfo'

    # Skip empty text nodes
    return if page.text =~ /\A\s*\Z/

    # We need to store redirects because sometimes a good page will have, as its
    # parent, a redirect page.
    if page.redirect
      @redirects[normalize(page.title)] = normalize(page.redirect)
      return
    end

    return if page.bad_title? || page.bad_body?

    unless page.top_level? || page.parent
      raise "No parent found for non-top-level page: #{page.title}"
    end

    @pages[normalize(page.title)] = page
  end

  # A page hierarchy is considered valid if every page is either a known top
  # level page or has a parent.  If this is not the case, we probably accidentally
  # let through some weird non-location page or otherwise didn't clean the data
  # enough.
  def valid?
    @pages.each do |normalized_title, page|

      while page
        parent = @pages[normalize(page.parent)]
        parent ||= @pages[@redirects[normalize(page.parent)]]
        if parent.nil? && !page.top_level?
          binding.pry
          raise "Page #{page.title} had an invalid page chain"
        end
        page = parent
      end
    end
  end

  private

  def initialize(root)
    @root = root

    # A map of normalized page titles to page objects
    @pages = {}

    # A map of normalized page titles to their redirected page titles (also
    # normalized)
    @redirects = {}
  end

  def normalize(title)
    title
      &.gsub('_', ' ')
      &.gsub('‎','') # remove special character space
      &.strip
      &.downcase
  end
end

page_hierarchy = PageHierarchy.from_xml_file('enwikivoyage-latest-pages-articles.xml')
page_hierarchy.valid?
puts 'done'

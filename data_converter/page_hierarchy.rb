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

  # Get a map of each page to an ordered list of its ancestors.  Eg:
  # {
  #   "Aalborg"=>["North Jutland", "Jutland", "Denmark", "Nordic countries", "Europe"],
  #   "Aalst"=>["East Flanders", "Flanders", "Belgium", "Benelux", "Europe"],
  #   etc
  # }
  def to_ancestor_map
    ancestor_map = {}
    @pages.each do |normalized_title, page|
      ancestor_map[page.title] = ancestor_list = []
      while page
        parent = @pages[normalize(page.parent)]
        parent ||= @pages[@redirects[normalize(page.parent)]]

        ancestor_list << parent.title if parent

        page = parent
      end
    end

    ancestor_map
  end

  # A page hierarchy is considered valid if every page is either a known top
  # level page or has a parent.  If this is not the case, we probably accidentally
  # let through some weird non-location page or otherwise didn't clean the data
  # enough.
  def validate!
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

require './constants'

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

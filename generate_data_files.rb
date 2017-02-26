# This file reads the wikivoyage page data, cleans it, and dumps it to a json
# structure.  It's not ideal, since it involves sending a lot of data to the
# client.  On the other hand, it means I can do this stuff all offline and just
# have all the app logic live in JS-land.  That lets me do this all with flat
# files and host it off github pages
#
# TODO: clean all this up.  It's still in "hack together a quick POC" state

require 'nokogiri'
require 'pry-byebug'
require 'set'
require 'json'

doc = File.open('enwikivoyage-latest-pages-articles.xml') { |f| Nokogiri::XML(f) }
root = doc.children.first

# Maps of page titles to whatever. 
node_to_parent = {}
node_to_redirect = {}
node_to_cannonical_name = {}

TOP_LEVEL = ['Africa', 'Antarctica', 'Asia', 'Eurasia', 'Europe', 'Latin America', 'North America', 'Oceania', 'South America', 'Other destinations']

manual_skip = [
]

# TODO: handle the case where the value in node_to_parent matches another key if we ignore case
# (eg the parent of "Elliot Lake" is "northern Ontario" but the page name is actually "Northern Ontario")
def get_parent(title, node_to_parent, node_to_redirect)
  parent = node_to_parent[title] || node_to_parent[node_to_redirect[title]]
end

def find_path(title, node_to_parent, node_to_redirect)
  parent = get_parent(title, node_to_parent, node_to_redirect)

  # There's probably a faster way to do this, but it doesn't matter now.
  if !parent
    [title]
  else
    [title] + find_path(parent, node_to_parent, node_to_redirect)
  end
end

def clean(name)
  name
    &.gsub('_', ' ')
    &.gsub('‎','') # special character space
    &.strip
end
def normalize(name)
  clean(name)&.downcase
end

root.children.each do |node|

  next if node.name == 'siteinfo'

  # Skip empty text nodes
  next if node.text =~ /\A\s*\Z/

  page_name = node.children.find {|child| child.name == 'title' }.text.strip

  #if page_name == 'Flinders Ranges'
    #binding.pry
  #end

  redirect = node.children.find { |child| child.name == 'redirect' }
  if redirect
    redirect_to = redirect.attributes['title'].value.strip
    node_to_redirect[normalize(page_name)] = normalize(redirect_to)
    next
  end


  # This may not be 100% reliable, but there doesn't seem to be a better way
  # to identify phrasebooks
  next if page_name =~ /phrasebook/i
  next if page_name =~ /^(wikivoyage|mediawiki|template|category|file|module):/i

  revision = node.children.find { |child| child.name == 'revision' }

  # TODO: use xslt or something here
  body_node = revision.children.find do |child|
    child.name == 'text' && child.attributes&.[]('space')&.value == 'preserve'
  end
  body_text = body_node.children.first.text

  next if body_text.match(/{{(itinerary|disamb|disambig|disambiguation|Phrasebookguide|joke|WikivoyageDoc\|policies|Title-Index page|historical|documentation|vfd)}}/i)
  next if body_text.match(/{{GalleryPageOf\|.*?}}/)

  part_match = body_text.match(/{{IsPartOf\|([^}|]*)(?:|.*?)?}}/i)

  next if manual_skip.include? page_name

  #raise "zomg no is_part_of for page_name #{page_name}" unless part_match
  unless part_match || TOP_LEVEL.include?(page_name)

    # Skip over special travel topics (like "fauna of africa" or whatever)
    # TODO: pull out the region of the topic (eg aftrica) which is included in
    # some of these and use that for filtering.
    if body_text.match /{{PartOfTopic\|.*?}}/i
      next
    else
      binding.pry
      puts "not a part of something"
    end
  end

  is_part_of = part_match&.[](1)
  parent = clean(is_part_of)

  #normalized_name = normalize(parent)
  if node_to_parent[normalize(page_name)]
    binding.pry
    puts 'already have a parent for this one'
  end

  node_to_parent[normalize(page_name)] = normalize(parent)
  node_to_cannonical_name[normalize(page_name)] = page_name
end

#first_bad = node_to_parent.keys.find { |title| !TOP_LEVEL.map(&:downcase).include? find_path(title, node_to_parent, node_to_redirect).last }
File.open('data/node_to_parent.json', 'w'){ |f| f << node_to_parent.to_json }
File.open('data/node_to_redirect.json', 'w'){ |f| f << node_to_redirect.to_json }
File.open('data/node_to_cannonical_name.json', 'w'){ |f| f << node_to_cannonical_name.to_json }


puts 'done'

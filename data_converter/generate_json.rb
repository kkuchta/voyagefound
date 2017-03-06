require 'set'
require 'json'
require 'nokogiri'
require 'pry-byebug'

require './page'
require './page_hierarchy'

page_hierarchy = PageHierarchy.from_xml_file('enwikivoyage-latest-pages-articles.xml')
#page_hierarchy.validate!
puts page_hierarchy.to_ancestor_map.to_json
puts 'done'

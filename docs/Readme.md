I like browsing random locations on Wikivoyage, a wikipedia-like travel site, to explore places I might like to travel to.  However, wikivoyage's "Random" button tends to take me to one of the bazillion little towns in New England more often than not.

VoyageFound is a tool I built on top of Wikivoyage.  It lets you jump to a random page, subject to filters you can define.  For example, if you want to leave out all of the US, you can add "United States" to the exclude filter.  If you want to search for places in Asia but you've already been to a few countries, you can include Asia but exclude Vietnam and Thailand.

## Usage

Click the "Random" button to view a random spot that fits your filters.  Hit it again to see a new one.

<blockquote class="imgur-embed-pub" lang="en" data-id="a/Wfntn"><a href="//imgur.com/Wfntn"></a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>

Add filters using the "Filter pages by" text box.

<blockquote class="imgur-embed-pub" lang="en" data-id="a/8ijUo"><a href="//imgur.com/8ijUo"></a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>

The **In one of** filters will tell VoyageFound to look for places in _any_ of the listed locations.  The **But not in** filters will tell it to leave _out_ any results matching any listed locations.

## Tech

From a tech perspective, this is built with react (as a beginner learning project).  The script to pull data from the data dump is ruby.  This is deployed on S3 behind Cloudfront with Route53 for the DNS.

Back to the app: [https://voyagefound.com](https://voyagefound.com)

Code (and a more thorough writeup): [https://github.com/kkuchta/wikiexplorer](https://github.com/kkuchta/wikiexplorer)

Author: [http://kevinkuchta.com](http://kevinkuchta.com)

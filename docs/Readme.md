I like browsing random locations on Wikivoyage, a wikipedia-like travel site, to explore places I might like to travel to.  However, wikivoyage's "Random" button tends to take me to one of the bazillion little towns in New England more often than not.

VoyageFound is a tool I built on top of Wikivoyage.  It lets you jump to a random page, subject to filters you can define.  For example, if you want to leave out all of the US, you can add "United States" to the exclude filter.  If you want to search for places in Asia but you've already been to a few countries, you can include Asia but exclude Vietnam and Thailand.

<blockquote class="imgur-embed-pub" lang="en" data-id="a/Wfntn"><a href="//imgur.com/Wfntn"></a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>

You can set filters at any level of granularity from continents to small towns.  The different kinds of places you can select are pulled from wikivoyage's data dumps.

From a tech perspective, this is built with react (as a beginner learning project).  The script to pull data from the data dump is ruby.  This is deployed on S3 behind Cloudfront with Route53 for the DNS.

Back to the app: [https://voyagefound.com](https://voyagefound.com)

Code: [https://github.com/kkuchta/wikiexplorer](https://github.com/kkuchta/wikiexplorer)

Author: [https://kevinkuchta.com](https://kevinkuchta.com)

![explanatory gif](https://i.imgur.com/nniyzzi.gif)

# About

VoyageFound is a tool for browsing random WikiVoyage.org pages, but filterable.  For more about it, see [this page](http://kevinkuchta.com/voyagefound/).

# Code

The code is divided into two chunks: the ruby data converter (which parses wikivoyage's data dumps into something useful), and the react web ui.

## A note on code quality

This was a quick hack project while I was learning react.  There's lots of cruft, commented out code, inefficient logic, etc.  Maybe I'll clean it up at some point, maybe I won't.  Producing maintainable code was _not_ a goal of this project.  :)

## The data converter

Wikivoyage has a location hierarchy on each page.  Eg for London it's "Europe > Britain and Ireland > United Kingdom > England > London".  Wikivoyage, like most(all?) wikimedia projects, provides regular xml data dumps.  You'd _think_ that this means that hierarchy is nicely-formatted somewhere in that data dump!  You'd be wrong.

It turns out that each wikivoyage page has a user-entered tag somewhere in it pointing to the next highest hierarchy node.  So, somewhere in the source for the London page, there'll be a tag like `{{IsPartOf|England}}`.  Sometimes that tag points to a real node, sometimes it doesn't.  Sometimes it points to an alias of a real page.  Sometimes it points to a real page with different spaces or punctuation.  Sometimes it's on a page that's actually a phrasebook/guidebook/trip/disamb/disambig/disambiguation/joke/doc/policy/historical/index page.

What I'm saying is, the data's messy and we have to parse it ourselves to build this tree-like hierarchy from unreliable node-pointers.

It _is_ doable, though.  It only took one or two long afternoons full of swearing and special-casing.  The result is a script that takes the xml data dump and produces a gigantic json map like:

    "London": [
        "England",
        "United Kingdom",
        "Britain and Ireland",
        "Europe"
    ],

This script is run offline and the result is deployed with the javascript.  If run every 6 to 12 months, this should be fine.  And it keeps me from having to manage a live ruby server — hosting static JS is much cheaper and lower-maintenance.

## The web UI

The premise is that we have a little control panel sitting at the top of the page and load our random wikivoyage pages in iframes at the bottom.

The control panel was my first foray into React (almost a year ago now).  I decided to stick with _just_ react, although I pretty quickly ran into the need to manage state.  Redux, et al, might have been a bit overkill, but maybe not.

The web UI loads the giant json map asynchronously and parses it before any user interaction.  This _seems_ pretty rough, since it's a 3.6mb json file.  In practice, though, it seems pretty fast (even on mobile).  The json map is cached in cloudfront for a reasonably fast first load, then in your browser after that.  Actually, //todo: double check that cloudfront is correctly sending cache headers for that file.

There are lots of ways we could speed up loading.  Right now we show a loading screen until the json file is loaded; we could totally do that behind-the-scenes.  We'd just have to make any functionality that relies on the json file being loaded asynchronous.

Anyway, once the hierarchy data is loaded, we parse it into a 1-deep index for faster type-ahead searching.  I tried using a full trie structure, but the overhead for managing that was too slow.  This got me acceptable typeahead search performance, so I called it good enough.

# Developing

# Generate the json

1. DL the xml file from https://dumps.wikimedia.org/enwikivoyage/latest/enwikivoyage-latest-pages-articles.xml.bz2 and unzip it into the data_converter directory
2. Run `( cd data_converter; ruby generate_json.rb ) > public/ancestors.json`

# Run the webapp locally

This is a slightly-out-of-date install of [create-react-app](https://github.com/facebookincubator/create-react-app), so much of their documentation is accurate for this project.

`npm install` first, then `npm start` to start local dev.

# Deploy

`npm run build` will produce a deployable-build.

`AWS_PROFILE=whatever sh ./publish.sh` will run the build and push it to S3.  Since it's behind cloudfront now and I don't feel like updating the publish script to handle that right now, just create a cloudfront invalidation for `*` manually after each deploy.

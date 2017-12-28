![explanatory gif](https://i.imgur.com/GIghhde.gif)
# About

VoyageFound is a tool for browsing random WikiVoyage.org pages, but filterable.  For more about it, see [this page](http://kevinkuchta.com/voyagefound/).

# Generate the json

1. DL the xml file from https://dumps.wikimedia.org/enwikivoyage/latest/enwikivoyage-latest-pages-articles.xml.bz2 and unzip it
2. Run `( cd data_converter; ruby generate_json.rb ) > public/ancestors.json`
3. `npm run start` to start the local webapp

`# TODO: actual setup instructions here`

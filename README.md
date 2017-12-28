# Generate the json

1. DL the xml file from https://dumps.wikimedia.org/enwikivoyage/latest/enwikivoyage-latest-pages-articles.xml.bz2 and unzip it
2. Run `( cd data_converter; ruby generate_json.rb ) > public/ancestors.json`
3. `npm run start` to start the local webapp

`# TODO: actual setup instructions here`

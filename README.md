# Web_Portfolio

Derek Dreblow's personal webportfolio

Enjoy some simple HTML and CSS, with a minimist approach to the site. This repo hopes to help others get going a personal web portfolio, as well.

## Dependencies
1) `markdown-it` - MD to HTML converter
2) `Gray-Matter` - MD meta data to HTML meta data
3) `Highlight`   - MD to CSS converter, mainly for code

## Development
### Local Server
* Its best to develop webpages through a local server. Launch the `LocalServer.py`, located in root/resources/dev/
* Make sure to be in the directory of `index.html`, and call the location of the py file. 

### Blog
* Blog is about converting MD files to HTML/CSS to share with the world. After the completion of every MD file, run `convert.js`, and the output files will be in the corresponding folder structure.
* The structure being `local_markdown` -> `local_html`.
* The terminal call is `node convert.js`
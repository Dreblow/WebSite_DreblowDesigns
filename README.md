# Web_Portfolio

Derek Dreblow's personal web portfolio

Enjoy some simple HTML and CSS, with a minimist approach to the site. This repo hopes to help others get going a personal web portfolio, as well.

## Dependencies
### npm packages
1) `markdown-it` - MD to HTML converter
2) `Gray-Matter` - MD meta data to HTML meta data
3) `Highlight`   - MD to CSS converter, mainly for code

### npm package download
In the root of your project folder (same directory as your package.json):
``` bash
npm install
```

___

## Development
### npm commands 
kick off a local server and browser
``` bash
npm run dev
```

When converting blogs
``` bash
npm run convert-blog 
```

### Local Server
For PHP based local server,  type 
``` bash
php -S localhost:8000
```


### Blog
* Blog is about converting MD files to HTML/CSS to share with the world. After the completion of every MD file, run `convert.js`, and the output files will be in the corresponding folder structure.
* The structure being `local_markdown` -> `local_html`.
* The terminal call is `node convert.js`
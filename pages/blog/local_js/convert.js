// convert.js
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");

const { renderCommandCard } = require("./convertToCommandCardStyle.js");
const { renderGitWikiStyle } = require("./convertToGitWikiStyle.js");

const ROOT_DIR = "../../../"
const ROOT_BLOG_DIR = "../"
const inputDir = path.join(__dirname, ROOT_BLOG_DIR + 'local_markdown');
const outputDir = path.join(__dirname, ROOT_BLOG_DIR + 'local_html');

const imageFoldersToCopy = [];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function processDirectory(inputPath, outputPath) {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const items = fs.readdirSync(inputPath);

  items.forEach(item => {
    const itemPath = path.join(inputPath, item);
    const outputItemPath = path.join(outputPath, item);

    if (fs.lstatSync(itemPath).isDirectory()) {
      processDirectory(itemPath, outputItemPath);
    } else if (path.extname(item) === '.md') {
      const fileContent = fs.readFileSync(itemPath, 'utf-8');
      const { data: frontMatter, content } = matter(fileContent);

      scanForImagePaths(imageFoldersToCopy, content, inputPath, outputPath);

      const htmlFileName = `${path.basename(item, '.md')}.html`;
      const outputFilePath = path.join(outputPath, htmlFileName);
      const relativePath = calculateRelativePath(outputItemPath, outputDir);
      const relativeUrl = path.join(outputPath, htmlFileName)
        .replace(path.join(__dirname, '..', '..', '..'), '') // Trim to site root
        .replace(/\\/g, '/');  

      const jasonLD = formatJasonLD(frontMatter, relativeUrl);

      const header = formatHeader(relativePath, ROOT_DIR);
      const footer = formatFooter(relativePath, ROOT_DIR);

      const formattedVersion = formatVersionDate(frontMatter.version, itemPath);

      const css = frontMatter.machine === "mixed" ? ["git-wiki-style-blog", "command-card-blog"]
                : frontMatter.machine === "command-card" ? "command-card-blog" : "git-wiki-style-blog";
      const head = formatHead(frontMatter, relativePath, relativeUrl, jasonLD, ROOT_DIR, ROOT_BLOG_DIR, css);

      // Pick renderer
      let bodyContent;

      if (frontMatter.machine === "mixed") {
        const sections = splitIntoRenderSections(content, "git-wiki-style-blog");

        bodyContent = sections.map((section, index) => {
          const versionForSection = index === 0 ? formattedVersion : "";

          if (section.machine === "command-card") {
            return renderCommandCard(versionForSection, section.content);
          }

          return renderGitWikiStyle(versionForSection, section.content);
        }).join("\n");

      } else if (frontMatter.machine === "command-card") {
        bodyContent = renderCommandCard(formattedVersion, content);

      } else {
        bodyContent = renderGitWikiStyle(formattedVersion, content);
      }

      const htmlContent = renderBlogPage(head, header, footer, bodyContent);

      fs.writeFileSync(outputFilePath, htmlContent, 'utf-8');
      console.log(`Converted: ${itemPath} -> ${outputFilePath}`);
    }
  });
}

processDirectory(inputDir, outputDir);
copyImageFolders(imageFoldersToCopy);
console.log("✅ Completed generating blog");

// ********** Supporting Functions ********** //

function renderBlogPage(head, header, footer, bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
${head}
<body>
    ${header}
    ${bodyContent}
    ${footer}
</body>
</html>`;
}

// Format the version date
function formatVersionDate(dateString, sourceFile = "") {
    if (dateString === undefined || dateString === null || dateString === "") {
        throw new Error(
            `Missing version date${sourceFile ? ` in: ${sourceFile}` : ""}\n` +
            `Add a version field to the markdown front matter, for example:\n\n` +
            `version: 2025-09-18`
        );
    }

    let date;

    if (dateString instanceof Date && !isNaN(dateString)) {
        date = dateString;
    } else if (!isNaN(Date.parse(dateString))) {
        date = new Date(dateString);
    } else {
        const dateParts = String(dateString).match(
            /(\w{3}) (\w{3}) (\d{1,2}) (\d{4}) (\d{2}:\d{2}:\d{2})/
        );

        if (dateParts) {
            const [, , month, day, year] = dateParts;
            const months = {
                Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
            };

            date = new Date(year, months[month], day);
        } else {
            throw new Error(
                `Invalid version date${sourceFile ? ` in: ${sourceFile}` : ""}: ${dateString}\n` +
                `Use a markdown front matter version like:\n\n` +
                `version: 2025-09-18`
            );
        }
    }

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    return date.toLocaleDateString('en-US', options);
}

function calculateRelativePath(filePath, basePath) {
  const relativeDepth = path.relative(filePath, basePath).split(path.sep).length - 1;
  return ROOT_BLOG_DIR.repeat(relativeDepth);
}

function formatHead(meta, relativePath, relativeUrl, jasonLD, ROOT_DIR, ROOT_BLOG_DIR, css){

    const frontMatter = meta || {};
    const title = frontMatter.title || 'Dreblow Designs Blog';
    const description = frontMatter.description || 'Discover the latest blog posts from Derek Dreblow, focusing on engineering, software development, and project insights.';
    const author = frontMatter.author || "Derek Dreblow";
    const keywords = frontMatter.keywords || "Dreblow Design's Blog";
    const image = frontMatter.image || "https://www.dreblowdesigns.com/pages/blog/local_images/BlogFavicon.png";
    const url = `https://www.dreblowdesigns.com${relativeUrl}`;

  return `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${description}">
    <meta name="author" content="${author}">
    <title>Dreblow Design - ${title} blog</title>
    <meta name="keywords" content="${keywords}">
    <link rel="canonical" href="${url}">
    
    <!-- Open Graph Metadata -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="website">

    <!-- Jason LD -->
    ${jasonLD}
    
    <!-- Twitter Card Metadata -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">

    <!-- Default favicon -->
    <link rel="icon" type="image/svg+xml" href="https://www.dreblowdesigns.com/resources/images/favicon_io/favicon.svg" />
    <link rel="shortcut icon" href="https://www.dreblowdesigns.com/favicon.ico" />

    <!-- PNG favicon for high-resolution displays -->
    <link rel="icon" type="image/png" href="https://www.dreblowdesigns.com/resources/images/favicon_io/favicon-96x96.png" sizes="96x96" />

    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" sizes="180x180" href="https://www.dreblowdesigns.com/resources/images/favicon_io/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="Dreblow Designs">
    
    <!-- Site Manifest-->
    <link rel="manifest" href="https://www.dreblowdesigns.com/resources/images/favicon_io/site.webmanifest" />
    

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-9RT1T06DM1"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9RT1T06DM1');
    </script>

    <link rel="stylesheet" href="${ROOT_DIR}${relativePath}resources/css/styles.css?v=__DDS_CACHE_BUST__">
    <link rel="stylesheet" href="${ROOT_BLOG_DIR}${relativePath}local_css/blog.css?v=__DDS_CACHE_BUST__">
    <link rel="stylesheet" href="${ROOT_BLOG_DIR}${relativePath}local_css/github-dark.min.css?v=__DDS_CACHE_BUST__">
    ${formatBlogCssLinks(css, ROOT_BLOG_DIR, relativePath)}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>`;
}

function formatHeader(relativePath, ROOT_DIR){
  return `<header>
        <nav>
            <ul>
                <li><a href="/" aria-label="Home">Home</a></li>
                <li><a href="${ROOT_DIR}${relativePath}pages/about.html" aria-label="About">About</a></li>
                <!--<li><a href="${ROOT_DIR}${relativePath}pages/portfolio.html">Portfolio</a></li>-->
                <li><a href="${ROOT_DIR}${relativePath}pages/contact/contact.html" aria-label="Contact">Contact</a></li>
                <li><a href="${ROOT_DIR}${relativePath}pages/blog/local_html/blog.html" aria-label="Blog">Blog</a></li>
            </ul>
        </nav>
    </header>`;
}

function formatFooter(relativePath, ROOT_DIR){
  return `<footer>
        <div class="social-links">
            <a href="https://www.linkedin.com/in/derek-dreblow-4756134b/" target="_blank">
                <i class="fab fa-linkedin"></i> LinkedIn
            </a>
            <a href="https://github.com/Dreblow" target="_blank">
                <i class="fab fa-github"></i> GitHub
            </a>
            <a href="https://leetcode.com/u/dreblow/" target="_blank">
                <img src="${ROOT_DIR}${relativePath}resources/images/brands/LeetCode/leetcode.png" alt="LeetCode Logo" style="width: 15px; height: 15px;"> LeetCode
            </a>
            <a href="https://www.threads.net/@derek_dre" target="_blank">
                <img src="${ROOT_DIR}${relativePath}resources/images/brands/threads/threads.png" alt="Threads Logo" style="width: 15px; height: 15px;"> Threads
            </a>
        </div>
        <p class="copy-right">&copy; 2024 - <span id="copyright-year"></span> Derek Dreblow, Dreblow Designs. All Rights Reserved.</p>
        <script>
            document.getElementById("copyright-year").textContent = new Date().getFullYear();
        </script>
    </footer>`;
}

function formatJasonLD(meta, relativeUrl) {
  const frontMatter = meta || {};
  const title = frontMatter.title || "Dreblow Designs Blog";
  const description = frontMatter.description || "Discover the latest blog posts from Derek Dreblow, focusing on engineering, software development, and project insights.";
  const author = frontMatter.author || "Derek Dreblow";
  const keywords = frontMatter.tags || [];  // use tags array from front matter
  const categories = frontMatter.categories || [];
  const image = frontMatter.image || "https://www.dreblowdesigns.com/pages/blog/local_images/BlogFavicon.png";
  const datePublished = frontMatter.version || new Date().toISOString().split("T")[0];
  const url = `https://www.dreblowdesigns.com${relativeUrl}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "keywords": keywords,
    "articleSection": categories,
    "datePublished": datePublished,
    "image": image,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": "Dreblow Designs",
      "logo": {
        "@type": "ImageObject",
        "url": "https://dreblowdesigns.com/resources/images/favicon_io/favicon-96x96.png"
      }
    }
  };

  // Indent each line of the JSON-LD block with 4 spaces
  const jsonString = JSON.stringify(jsonLd, null, 2)
    .split('\n')
    .map(line => '    ' + line)
    .join('\n');

  return `<script type="application/ld+json">
${jsonString}
    </script>`;
}

function scanForImagePaths(folders, content, inputPath, outputPath) {
  const imagePathRegex = /!\[.*?\]\((.*?)\)/g;
  let match;

  while ((match = imagePathRegex.exec(content)) !== null) {
    const imgPath = match[1];
    const ext = path.extname(imgPath).toLowerCase();

    const allowedExts = ['.png', '.webp'];
    if (allowedExts.includes(ext) && imgPath.includes('/')) {
      const subfolder = path.dirname(imgPath);  // everything before the filename
      const sourceDir = path.join(inputPath, subfolder);
      const destDir = path.join(outputPath, subfolder);

      if (!folders.some(folder => folder.sourceDir === sourceDir && folder.destDir === destDir)) {
        console.log(`📁 Adding folder to copy list: ${sourceDir} -> ${destDir}`);
        folders.push({ sourceDir, destDir });
      }
    }
  }
}

function copyImageFolders(folders) {
  folders.forEach(({ sourceDir, destDir }) => {
    if (!fs.existsSync(sourceDir)) {
      console.warn(`Source directory does not exist: ${sourceDir}`);
      return;
    }

    fs.mkdirSync(destDir, { recursive: true });

    const items = fs.readdirSync(sourceDir);
    items.forEach(item => {
      const srcPath = path.join(sourceDir, item);
      const destPath = path.join(destDir, item);
      const stat = fs.statSync(srcPath);

      if (stat.isDirectory()) {
        copyImageFolders([{ sourceDir: srcPath, destDir: destPath }]); // recurse
      } else {
        const ext = path.extname(item).toLowerCase();
        if (['.png', '.webp'].includes(ext)) {
          fs.copyFileSync(srcPath, destPath);
          console.log(`Copied image: ${srcPath} -> ${destPath}`);
        }
      }
    });
  });
}

  function splitIntoRenderSections(content, defaultMachine) {
    const sentinelRegex = /^<!--\s*render:\s*(command-card|git-wiki-style-blog)\s*-->\s*$/gmi;

    const sections = [];
    let currentMachine = defaultMachine || "git-wiki-style-blog";
    let lastIndex = 0;
    let match;

    while ((match = sentinelRegex.exec(content)) !== null) {
      const sectionContent = content.slice(lastIndex, match.index).trim();

      if (sectionContent.length > 0) {
        sections.push({
          machine: currentMachine,
          content: sectionContent
        });
      }

      currentMachine = match[1];
      lastIndex = sentinelRegex.lastIndex;
    }

    const finalContent = content.slice(lastIndex).trim();

    if (finalContent.length > 0) {
      sections.push({
        machine: currentMachine,
        content: finalContent
      });
    }

    return sections;
  }

  function formatBlogCssLinks(css, ROOT_BLOG_DIR, relativePath) {
    const cssFiles = Array.isArray(css) ? css : [css];

    return cssFiles
      .map(file => `    <link rel="stylesheet" href="${ROOT_BLOG_DIR}${relativePath}local_css/${file}.css?v=3">`)
      .join("\n");
  }
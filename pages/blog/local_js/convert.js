const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const matter = require('gray-matter');
const hljs = require('highlight.js'); 
const ROOT_DIR = "../../../"
const ROOT_BLOG_DIR = "../"

// Initialize Markdown-it with highlight.js
const md = new MarkdownIt({
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre><code class="hljs ${lang}">` +
                    hljs.highlight(str, { language: lang }).value +
                    `</code></pre>`;
            } catch (_) {}
        }

        return `<pre><code class="hljs">` + md.utils.escapeHtml(str) + `</code></pre>`;
    }
});

// Define input/output directories
const inputDir = path.join(__dirname, '../local_markdown'); // Input directory for Markdown files
const outputDir = path.join(__dirname, '../local_html');   // Output directory for HTML files

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to calculate relative path depth
function calculateRelativePath(filePath, basePath) {
    const relativeDepth = path.relative(filePath, basePath).split(path.sep).length - 1;
    return '../'.repeat(relativeDepth);
}

// Format the version date
function formatVersionDate(dateString) {
    // Attempt to parse the date string
    let date;

    // Try ISO 8601 format first
    if (!isNaN(Date.parse(dateString))) {
        date = new Date(dateString);
    } else {
        // Fallback to manual parsing if standard parsing fails
        const dateParts = dateString.match(
            /(\w{3}) (\w{3}) (\d{1,2}) (\d{4}) (\d{2}:\d{2}:\d{2})/ // Fri Nov 29 2024 16:00:00
        );

        if (dateParts) {
            const [, , month, day, year] = dateParts;
            const months = {
                Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
            };
            date = new Date(year, months[month], day);
        } else {
            console.warn(`Invalid date provided: ${dateString}`);
            return "Unknown Date"; // Fallback for invalid dates
        }
    }

    // Format the date to "Nov 29, 2024"
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Recursively process directories
function processDirectory(inputPath, outputPath) {
    // Ensure the output directory exists
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    // Read all files and directories
    const items = fs.readdirSync(inputPath);

    items.forEach(item => {
        const itemPath = path.join(inputPath, item);
        const outputItemPath = path.join(outputPath, item);

        // Check if item is a directory
        if (fs.lstatSync(itemPath).isDirectory()) {
            processDirectory(itemPath, outputItemPath); // Recurse into subdirectory
        } else if (path.extname(item) === '.md') {
            // Process Markdown files
            const fileContent = fs.readFileSync(itemPath, 'utf-8');
            const { data: frontMatter, content } = matter(fileContent);

            // Calculate the relative path from the output file to the root
            const relativePath = calculateRelativePath(outputItemPath, outputDir);
            const version = formatVersionDate(frontMatter.version); // Default if no version is provided
            const title = frontMatter.title || 'Dreblow Designs Blog';
            const description = frontMatter.description || 'Discover the latest blog posts from Derek Dreblow, focusing on engineering, software development, and project insights.';
            const author = frontMatter.author || "Derek Dreblow"
            const keyword = frontMatter.keyword || "Dreblow Design's Blog"
            const image = frontMatter.image || "https://dreblowdesigns.com/pages/blog/local_images/BlogFavicon.png"
            const url = frontMatter.url || "https://dreblowdesigns.com"

            // Generate HTML content
            const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${description}">
    <meta name="author" content="${author}">
    <meta name="keywords" content="${keyword}">
    <link rel="canonical" href="https://dreblowdesigns.com/pages/blog/local_html/blog.html">
    
    <!-- Open Graph Metadata -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${url}>
    <meta property="og:type" content="website">
    
    <!-- Twitter Card Metadata -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}

    <!-- Default favicon -->
    <link rel="icon" sizes="192x192" href="https://dreblowdesigns.com/favicon.ico" type="image/x-icon">

    <!-- PNG favicon for high-resolution displays -->
    <link rel="icon" href="${ROOT_DIR}${relativePath}resources/images/favicon_io/favicon-32x32.png" sizes="32x32" type="image/png">
    <link rel="icon" href="${ROOT_DIR}${relativePath}resources/images/favicon_io/favicon-16x16.png" sizes="16x16" type="image/png">

    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" href="${ROOT_DIR}${relativePath}resources/images/favicon_io/apple-touch-icon.png">

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-9RT1T06DM1"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9RT1T06DM1');
    </script>

    <link rel="stylesheet" href="${ROOT_DIR}${relativePath}resources/css/styles.css">
    <link rel="stylesheet" href="${ROOT_BLOG_DIR}${relativePath}local_css/blog.css">
    <link rel="stylesheet" href="${ROOT_BLOG_DIR}${relativePath}local_css/github-dark.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="${ROOT_DIR}${relativePath}index.html" aria-label="Home">Home</a></li>
                <li><a href="${ROOT_DIR}${relativePath}pages/about.html" aria-label="About">About</a></li>
                <!--<li><a href="${ROOT_DIR}${relativePath}pages/portfolio.html">Portfolio</a></li>-->
                <li><a href="${ROOT_DIR}${relativePath}pages/contact/contact.html" aria-label="Contact">Contact</a></li>
                <li><a href="${ROOT_DIR}${relativePath}pages/blog/local_html/blog.html" aria-label="Blog">Blog</a></li>
            </ul>
        </nav>
    </header>
    <main class="markdown-body">
        <article>
            <p><em class="blogVersion">Version: ${version}</em></p>
            ${md.render(content)}
        </article>
    </main>
    <footer>
        <div class="social-links">
            <a href="https://www.linkedin.com/in/derek-dreblow-4756134b/" target="_blank">
                <i class="fab fa-linkedin"></i> LinkedIn
            </a>
            <a href="https://github.com/Dreblow" target="_blank">
                <i class="fab fa-github"></i> GitHub
            </a>
            <a href="https://www.threads.net/@derek_dre" target="_blank">
                <img src="${ROOT_DIR}${relativePath}resources/images/brands/threads/threads.png" alt="Threads Logo" style="width: 15px; height: 15px;"> Threads
            </a>
        </div>
        <p class="copy-right">&copy; 2024 Derek Dreblow, Dreblow Designs. All Rights Reserved.</p>
    </footer>
</body>
</html>`;

            // Write the converted file to the output directory
            const outputFilePath = path.join(outputPath, `${path.basename(item, '.md')}.html`);
            fs.writeFileSync(outputFilePath, htmlContent, 'utf-8');
            console.log(`Converted: ${itemPath} -> ${outputFilePath}`);
        }
    });
}

// Start processing from the root directory
processDirectory(inputDir, outputDir);
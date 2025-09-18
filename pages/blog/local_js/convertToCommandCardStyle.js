//import { marked } from "marked";

export default function renderCommandCard(meta, body, ROOT_DIR, ROOT_BLOG_DIR, version, relativePath, url) {
  const html = marked(body);

  // Convert bash code blocks into cards
  const bubbleHtml = html.replace(
    /<pre><code class="language-bash">([\s\S]*?)<\/code><\/pre>/g,
    (match, commands) => {
      const lines = commands.trim().split("\n");
      return lines.map(line => `
        <div class="command-card">
          <code>${line.replace(/^#\s*/, "")}</code>
        </div>
      `).join("");
    }
  );

  const title = meta.title || "Dreblow Designs Blog";
  const description = meta.description || "Linux / Command card style blog";
  const author = meta.author || "Derek Dreblow";
  const keywords = meta.keywords || "Linux, Commands, Cheat Sheet";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
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
    
    <!-- Twitter Card Metadata -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">

    <!-- Default favicon -->
    <link rel="icon" type="image/svg+xml" href="https://dreblowdesigns.com/resources/images/favicon_io/favicon.svg" />
    <link rel="shortcut icon" href="https://dreblowdesigns.com/resources/images/favicon_io/favicon.ico" />

    <!-- PNG favicon for high-resolution displays -->
    <link rel="icon" type="image/png" href="https://dreblowdesigns.com/resources/images/favicon_io/favicon-96x96.png" sizes="96x96" />

    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" sizes="180x180" href="https://dreblowdesigns.com/resources/images/favicon_io/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="Dreblow Designs">
    
    <!-- Site Manifest-->
    <link rel="manifest" href="https://dreblowdesigns.com/resources/images/favicon_io/site.webmanifest" />
    

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-9RT1T06DM1"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9RT1T06DM1');
    </script>

    <link rel="stylesheet" href="${ROOT_DIR}${relativePath}resources/css/styles.css">
    <link rel="stylesheet" href="${ROOT_BLOG_DIR}${relativePath}local_css/github-dark.min.css">
    <link rel="stylesheet" href="${ROOT_BLOG_DIR}${relativePath}local_css/blog.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <main class="markdown-body">
    <article>
      <p><em class="blogVersion">Version: ${version}</em></p>
      ${bubbleHtml}
    </article>
  </main>
  <footer>
    <!-- your footer -->
  </footer>
</body>
</html>`;
}
# Web_Portfolio

Derek Dreblow's personal web portfolio.

Enjoy some simple HTML and CSS with a minimalist approach to the site. This repo also hopes to help others get started with a personal web portfolio of their own.

---

## Development Setup

Development tooling is stored in:

```text
local_dev/
```

Before running npm or Python development commands:

```bash
cd local_dev
```

---

## Dependencies

### Node.js / npm

Node.js is used for local development tooling such as the PHP development server, BrowserSync, and CSS watching.

Install npm dependencies:

```bash
cd local_dev
npm install
```

### Python

Python is used for static blog generation.

Create a virtual environment:

```bash
cd local_dev
python3 -m venv .venv
```

Activate it:

```bash
source .venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

When finished working in the virtual environment:

```bash
deactivate
```

---

## Development

### Start Local Development Environment

From `local_dev`:

```bash
npm run dev
```

This starts the local development server and BrowserSync environment.

### Local PHP Server

The PHP development server can also be started manually:

```bash
php -S localhost:8000 -t
```

---

## Blog Generation

Blog posts are written as Markdown files and converted into HTML while preserving the corresponding directory structure.

The general structure is:

```text
local_markdown/
    ⬇️
local_html/
```

Activate the Python virtual environment before generating blog content:

```bash
cd local_dev
source .venv/bin/activate
```

Run the blog generator:

```bash
python python/main.py
```

---

## Creating Blogs

Blog content can use multiple render styles within the same Markdown file.

### Wiki Style

```markdown
<!-- render: git-wiki-style-blog -->
```

### Command Card Style

```markdown
<!-- render: command-card-two-row -->
```

### Manual Template Area

```markdown
<!-- render: blank-template -->
```

The `blank-template` renderer reserves an HTML section for manually created content while allowing the static generator to continue updating the surrounding generated sections.
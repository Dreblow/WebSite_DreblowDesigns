import json

from pathlib import Path
from datetime import date, datetime


SITE_URL = "https://www.dreblowdesigns.com"

DEFAULT_IMAGE = (
    "https://www.dreblowdesigns.com/"
    "pages/blog/local_images/BlogFavicon.png"
)

PUBLISHER_LOGO = (
    "https://dreblowdesigns.com/"
    "resources/images/favicon_io/favicon-96x96.png"
)


def build_canonical_url(output_file: Path, blog_dir: Path) -> str:
    relative_path = output_file.relative_to(blog_dir)

    web_path = (
        Path("pages")
        / "blog"
        / relative_path
    )

    return f"{SITE_URL}/{web_path.as_posix()}"


def get_image(metadata: dict) -> str:
    return metadata.get(
        "image",
        DEFAULT_IMAGE,
    )


def build_json_ld(metadata: dict, canonical_url: str, image: str) -> str:
    version = metadata.get("version")

    if version is None:
        raise ValueError("Blog metadata is missing required field: version")

    if isinstance(version, (date, datetime)):
        date_published = version.isoformat()
    else:
        date_published = str(version)

    data = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": metadata.get(
            "title",
            "Dreblow Designs Blog",
        ),
        "description": metadata.get(
            "description",
            "",
        ),
        "author": {
            "@type": "Person",
            "name": metadata.get(
                "author",
                "Derek Dreblow",
            ),
        },
        "keywords": metadata.get(
            "tags",
            [],
        ),
        "articleSection": metadata.get(
            "categories",
            [],
        ),
        "datePublished": date_published,
        "image": image,
        "url": canonical_url,
        "publisher": {
            "@type": "Organization",
            "name": "Dreblow Designs",
            "logo": {
                "@type": "ImageObject",
                "url": PUBLISHER_LOGO,
            },
        },
    }

    json_text = json.dumps(
        data,
        indent=2,
    )

    return (
        '<script type="application/ld+json">\n'
        f'{json_text}\n'
        '</script>'
    )


def format_version_date(version) -> str:
    if isinstance(version, (date, datetime)):
        return (
            f"{version.strftime('%b')} "
            f"{version.day}, "
            f"{version.year}"
        )

    return str(version)
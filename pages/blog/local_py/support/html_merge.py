import re


RENDER_PATTERN = re.compile(
    r"<!-- DDS:RENDER:([a-zA-Z0-9-]+):START -->"
    r"([\s\S]*?)"
    r"<!-- DDS:RENDER:\1:END -->"
)


def get_existing_render_sections(
    html: str,
) -> list[dict]:
    sections = []

    for match in RENDER_PATTERN.finditer(html):
        sections.append(
            {
                "renderer": match.group(1),
                "html": match.group(0),
            }
        )

    return sections


def merge_render_sections(
    source_sections: list[dict],
    rendered_sections: list[str],
    existing_html: str,
) -> str:
    existing_sections = get_existing_render_sections(
        existing_html
    )

    merged = []

    source_index = 0
    existing_index = 0

    while source_index < len(source_sections):
        source_renderer = (
            source_sections[source_index]["renderer"]
        )

        new_rendered_html = (
            rendered_sections[source_index]
        )

        if existing_index >= len(existing_sections):
            merged.append(
                new_rendered_html
            )

            source_index += 1
            continue

        existing_renderer = (
            existing_sections[existing_index]["renderer"]
        )

        existing_rendered_html = (
            existing_sections[existing_index]["html"]
        )

        if source_renderer == existing_renderer:
            if source_renderer == "blank-template":
                merged.append(
                    existing_rendered_html
                )
            else:
                merged.append(
                    new_rendered_html
                )

            source_index += 1
            existing_index += 1
            continue

        # Mismatch:
        # Assume the source contains a newly inserted
        # renderer before the existing HTML section.
        #
        # Add the new section and leave the existing
        # section available for the next comparison.
        merged.append(
            new_rendered_html
        )

        source_index += 1

    # Preserve anything remaining in the existing HTML.
    #
    # We intentionally do not infer deletions.
    while existing_index < len(existing_sections):
        merged.append(
            existing_sections[existing_index]["html"]
        )

        existing_index += 1

    return "\n\n".join(merged)
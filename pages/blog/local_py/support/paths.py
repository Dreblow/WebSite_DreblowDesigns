from pathlib import Path


def get_path_prefixes(
    output_file: Path,
    output_dir: Path,
) -> tuple[str, str]:
    relative_output = output_file.relative_to(output_dir)

    depth = len(relative_output.parent.parts)

    relative_prefix = "../" * depth

    root_path = "../../../" + relative_prefix
    blog_path = "../" + relative_prefix

    return root_path, blog_path
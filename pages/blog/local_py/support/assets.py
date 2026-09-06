from pathlib import Path
import shutil


def copy_support_files(
    markdown_file: Path,
    input_dir: Path,
    output_dir: Path,
):
    source_support = (
        markdown_file.parent
        / "support"
    )

    if not source_support.exists():
        return

    relative_dir = (
        markdown_file.parent
        .relative_to(input_dir)
    )

    destination_support = (
        output_dir
        / relative_dir
        / "support"
    )

    shutil.copytree(
        source_support,
        destination_support,
        dirs_exist_ok=True,
    )
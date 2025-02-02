
# < ========================================================
# < Imports
# < ========================================================

import os

# < ========================================================
# < Constants
# < ========================================================

OUTPUT_PATH: str = "index.html"
DEMOS_DIRECTORY: str = "demos/"
BUILD_DIRECTORY: str = "build/"
CSS_PLACEHOLDER: str = "/* STYLE_PLACEHOLDER */"
DESCRIPTION_PLACEHOLDER: str = "<!-- DESCRIPTION_PLACEHOLDER -->"
LINKS_PLACEHOLDER: str = "<!-- LINKS_PLACEHOLDER -->"
SCRIPT_PLACEHOLDER: str = "// SCRIPT_PLACEHOLDER"

# < ========================================================
# < Functionality
# < ========================================================

def read_file(path: str) -> str:
    """Read a file to string, ensuring ROOT path is followed"""
    path = BUILD_DIRECTORY + path
    with open(path, 'r', encoding='utf-8') as file:
        output: str = file.read()
    return output

def write_output_file(content: str) -> str:
    """Write string content to index.html"""
    content = content.strip()
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as file:
        file.write(content)

def join_to_url(*parts: list[str]) -> str:
    """Join parts of a directory path into a single URL safe path"""
    return os.path.join(*parts).replace(os.sep, '/')

def generate_html_list(directory: str, depth = 1):
    """"""
    html = "<ul class='link-list'>\n"
    items = sorted(os.listdir(directory))
    heading_tag = f"h{depth + 1}"
    for item in items:
        full_path = join_to_url(directory, item)
        if os.path.isdir(full_path):
            text = item
            children = os.listdir(full_path)
            for child in children:
                child_path = join_to_url(full_path, child)
                if os.path.isfile(child_path) and child == "index.html":
                    name = child_path.split("/")[-2]
                    text = f'<a href="{child_path}">{name}</a>'
                    break
            html += f"    <li>\n"
            html += f"        <{heading_tag}>{text}</{heading_tag}>\n"
            html += generate_html_list(full_path, depth + 1)
            html += f"    </li>\n"
    html += "</ul>\n"
    return html

# < ========================================================
# < Execution
# < ========================================================

html = read_file("index.html")
css = read_file("styles.css")
description = read_file("description.html")
script = read_file("script.js")
links = generate_html_list(DEMOS_DIRECTORY)

html = html.replace(CSS_PLACEHOLDER, css)
html = html.replace(DESCRIPTION_PLACEHOLDER, description)
html = html.replace(SCRIPT_PLACEHOLDER, script)
html = html.replace(LINKS_PLACEHOLDER, links)

write_output_file(html)

# < ========================================================
# < Imports
# < ========================================================

from os import listdir
from os.path import isdir, join

# < ========================================================
# < Check for Subfolders in Demos
# < ========================================================

folder: str = "demos"
paths: list[str] = listdir(folder)
subfolders: list[str] = [path for path in paths if isdir(join(folder, path))]
print(f"Subfolders in Demos: {subfolders}")

# < ========================================================
# < Style Tag Contents
# < ========================================================

style_tag_contents: str = r"""
html, body {
    background-color: #333;
    color: #fff;
    font-family: monospace;
    margin: 0px;
    padding: 0px;
}

#container {
    padding: 12px 24px 12px 24px;
}

a {
    color: #fff;
}

h1 {
    margin-top: 8px;
    padding: 0px;
}

a:visited {
    color: #fff;
}

p {
    line-height: 1.6;
    margin-bottom: 4px;
    margin-top: 8px;
}

code {
    font-family: monospace;
    background-color: #616161;
    padding: 1px 2px;
    border-radius: 4px;
}

a code {
    color: inherit;
    text-decoration: none;
}

a code:visited {
    color: inherit;
}

#link-list {
    line-height: 1.7;
    padding-left: 14px;
}
"""

# < ========================================================
# < Container Div Contents
# < ========================================================

container_div_contents: str = r"""
<h1>HTML-Demos Homepage (GitHub Pages)</h1>

<p>
    The HTML for this page is generated in <a href="https://github.com/scarletti-ben/html-demos/blob/main/build/build.py"><code>build.py</code></a> via <a href="https://github.com/scarletti-ben/html-demos/actions/workflows/static.yml"><code>GitHub Actions</code></a>, which are configured in the custom workflow file <a href="https://github.com/scarletti-ben/html-demos/actions/workflows/static.yml"><code>static.yml</code></a>. The <code>build.py</code> script generates links to all <code>index.html</code> files in the <code>demos</code> folder, and its subdirectories, allowing the project to grow exponentially without need for manually adding each link to the body of the root <code>index.html</code>.
</p>
<p>
    Because the root <code>index.html</code> is built and not written, it is not tracked by the repository to avoid need for extra syncing. It seems to be inaccessible via <code>GitHub</code>.
</p>
<p>
    The reason <code>build.py</code> is needed is that sites hosted on <a href="https://pages.github.com/">GitHub Pages</a>  do not offer easy directory access and rely on relative or absolute links to sites in the site structure.
</p>
<p>
    If testing locally, this page is not needed, you can instead setup a local server via <code>python -m http.server</code> in the <code>demos</code> folder. Doing so opens <code>demos</code> as a directory and will give easy access to all demo sites.
</p>

<h2>Links</h1>

<ul id='link-list'>
    <li><a href="https://github.com/scarletti-ben/html-demos">Project README</a></li>
</ul>
"""

# < ========================================================
# < Script Tag Contents
# < ========================================================

script_tag_contents: str = f"""
// Find link-list
const linkList = document.getElementById('link-list');

// List of subfolders
const subfolders = {str(subfolders)};

// Loop through subfolders and create links
subfolders.forEach(subfolder => {{

    const listElement = document.createElement('li');
    const linkElement = document.createElement('a');

    linkElement.href = '{folder}/' + subfolder;
    linkElement.textContent = subfolder;

    listElement.appendChild(linkElement);
    linkList.appendChild(listElement);

}});
"""

# < ========================================================
# < Core HTML
# < ========================================================

html: str = f"""
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>HTML Demos Homepage</title>

    <style>
{style_tag_contents}
    </style>

</head>
<body>

    <div id="container">
{container_div_contents}
    </div>

    <script>
{script_tag_contents}
    </script>

</body>
</html>
"""

# < ========================================================
# < Create 'index.html' File
# < ========================================================

filepath: str = "index.html"
stripped: str = html.strip()
with open(filepath, "w", encoding = "utf-8") as file:
  file.write(stripped)

# < ========================================================
# < Print Current Directory
# < ========================================================

items: list[str] = listdir()
print(f"\nGitHub Pages Root Directory: {items}")
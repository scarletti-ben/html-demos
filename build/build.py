script: str = f"""
<script>

    // Find link-container and link-list
    const linkContainer = document.getElementById('link-container');
    const linkList = document.getElementById('link-list');
    
    // Create the list element and link element
    const listElement = document.createElement('li');
    const linkElement = document.createElement('a');

    // Alter link element
    linkElement.href = 'https://github.com/scarletti-ben';
    linkElement.textContent = 'test';
    
    // Append linkElement to link-list
    listElement.appendChild(linkElement);
    linkList.appendChild(listElement);

</script>
"""

html: str = f"""
<!DOCTYPE html>
<html lang='en'>
<head>

    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>HTML Demos Homepage</title>

    <style>

        html, body {{
            background-color: #333;
            color: #fff;
            font-family: monospace;
        }}

        a {{
            color: inherit;
        }}

        a:visited {{
            color: inherit;
        }}

        #link-container {{
            display: flex;
            flex-direction: column;
            gap: 10px;
        }}
    
        #link-container a {{
            color: rgb(0, 0, 255);
        }}
    
        #link-container a:visited {{
            color: #ff008c;
        }}
        
        code {{
            font-family: monospace;
            background-color: #616161;
            padding: 2px 3px;
            border-radius: 4px;
        }}

        a code {{
            color: inherit;
            text-decoration: none;
        }}

        a code:visited {{
            color: inherit;
        }}

    </style>

</head>

<body>

    <h1>HTML-Demos Homepage (GitHub Pages)</h1>

    <p>
        The HTML for this page is generated in <a href="https://github.com/scarletti-ben/html-demos/blob/main/build/build.py"><code>build.py</code></a> via <a href="https://github.com/scarletti-ben/html-demos/actions/workflows/static.yml"><code>GitHub Actions</code></a>, which are configured in the custom workflow file <a href="https://github.com/scarletti-ben/html-demos/actions/workflows/static.yml"><code>static.yml</code></a>. The <code>build.py</code> script generates links to all <code>index.html</code> files in the <code>demos</code> folder, and its subdirectories, allowing the project to grow exponentially without need for manually adding each link to the body of the root <code>index.html</code>.
    </p>
    <p>
        Because the root <code>index.html</code> is built and not written, it is not tracked by the repository to avoid need for extra syncing. It seems to be inaccessible via <code>GitHub</code>.
    </p>
    <p>
        The reason <code>build.py</code> is needed is that sites hosted on <a href="https://pages.github.com/">GitHub</a> pages do not offer easy directory access and rely on relative or absolute links to sites in the site structure.
    </p>
        If testing locally, this page is not needed, you can instead setup a local server via <code>python -m http.server</code> in the <code>demos</code> folder. Doing so opens <code>demos</code> as a directory and will give easy access to all demo sites.
    </p>

    <div id='link-container'>
        <ul id='link-list'>

        </ul>
    </div>

{script}

</body>

</html>
"""

filepath: str = "index.html"
stripped: str = html.strip()
with open(filepath, "w", encoding = "utf-8") as file:
  file.write(stripped)
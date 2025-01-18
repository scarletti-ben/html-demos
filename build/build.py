script: str = f"""
  <script>
    console.log('test')
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

  </style>

</head>

<body>

  <h1>HTML-Demos Homepage (GitHub Pages)</h1>

  <p>
    If testing locally, this page is not needed, you can run <code>local-server.bat</code> or <code>python -m http.server</code> in the <code>demos</code> folder. Doing so opens <code>demos</code> as a directory and will give easy access to all demo sites. This site runs <code>JavaScript</code> to generate links to all sites in the <code>demo</code> folder.
  </p>

  <div id='link-container'>
    <ul id='link-list'>
    
    </ul>
  </div>

{script}

</body>

</html>
"""

print("TESTING")
with open("../index.html", "w", encoding = "utf-8") as file:
  file.write(html.strip())
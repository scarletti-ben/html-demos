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

import os

# Print the current working directory
print("Current directory before writing:", os.getcwd())

# Path to the file
file_path = "../index.html"

# Write to the file
print("Writing index.html...")
with open(file_path, "w", encoding = "utf-8") as file:
    file.write(html.strip())

# Check if the file was created and print the status
if os.path.exists(file_path):
    print(f"{file_path} has been successfully created!")
else:
    print(f"Failed to create {file_path}.")

# Now, read the content of the written file to verify
print("Reading the written file:")
with open(file_path, "r", encoding="utf-8") as file:
    content = file.read()
    print(content[:100])  # Print first 100 characters of the file to verify content
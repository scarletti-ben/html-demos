### Information
- Very little effort, if any, has been put into error catching in `JavaScript`
    - I am aware this will be my downfall, but as a demo project it makes it easier to read the code

### Miscellaneous

# - local files inside the Pyodide virtual file system
await micropip.install("emfs://.../package.whl")

// Downloading an archive
await pyodide.runPythonAsync(`
    from pyodide.http import pyfetch
    response = await pyfetch("https://.../your_package.tar.gz") # .zip, .whl, ...
    await response.unpack_archive() # by default, unpacks to the current dir
`)
pkg = pyodide.pyimport("your_package");
pkg.do_something();

You can call python functions IN the javascript

there is an emscripten filesystem

function runPython(code) {
  pyodide.pyodide_py.code.eval_code(code, pyodide.globals);
}
async function runPythonAsync(code) {
  return await pyodide.pyodide_py.code.eval_code_async(code, pyodide.globals);
}
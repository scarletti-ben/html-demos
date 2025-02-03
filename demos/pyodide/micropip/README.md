# To use Micropip You Must Be in Async Python


If the file is on a remote server, the server must set Cross-Origin Resource Sharing (CORS) headers to allow access. If the server doesn’t set CORS headers, you can use a CORS proxy. Note that using third-party CORS proxies has security implications, particularly since we are not able to check the file integrity, unlike with installs from PyPI. See this stack overflow answer for more information about CORS.

#

Python packages that contain C-extensions

If a package has C-extensions (or any other compiled codes like Rust), it will not have a pure Python wheel on PyPI.

Trying to install such a package with micropip.install will result in an error like:

ValueError: Can't find a pure Python 3 wheel for 'tensorflow'.
See: https://pyodide.org/en/stable/usage/faq.html#micropip-can-t-find-a-pure-python-wheel
You can use `await micropip.install(..., keep_going=True)` to get a list of all packages with missing wheels.
To install such a package, you need to first build a Python wheels for WASM/Emscripten for it.
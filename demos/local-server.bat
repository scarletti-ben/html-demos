@ECHO off & @REM Disable posting of commands to terminal
CD /d "%~dp0" & @REM Set the current working directory to the directory of this file
CALL python -m http.server & @REM Activate local server on http://localhost:8000/
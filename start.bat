@echo off
echo Starting Lone Star Image Editor...
cd /d "%~dp0"
.\node_modules\.bin\electron.cmd dist\main\index.js
pause

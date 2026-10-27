@echo off
setlocal
cd /d "%~dp0"

for %%I in (.) do set "NAME=%%~nxI"
set "OUT=%NAME%-clean.zip"

if exist "%OUT%" del "%OUT%"

echo Zipping %NAME% ...

tar -a -c -f "%OUT%" ^
  --exclude=node_modules ^
  --exclude=.git ^
  --exclude=.env ^
  --exclude=.env.local ^
  --exclude=.env.production ^
  --exclude=.env.development ^
  --exclude=.env.*.local ^
  --exclude=*.pem ^
  --exclude=*.key ^
  --exclude=dist ^
  --exclude=build ^
  --exclude=.vercel ^
  --exclude=.netlify ^
  --exclude=*.log ^
  --exclude=*.zip ^
  .

echo.
echo Done! Created %OUT%
pause

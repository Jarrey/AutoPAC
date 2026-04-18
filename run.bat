@echo off
set source=%~dp0
set target=%~dp0
set cnip_file=chn_ip.txt
set proxy_file=proxy.pac


cd %source%
if exist %cnip_file%_old (
    del /F /Q %cnip_file%_old
)

ren %cnip_file% %cnip_file%_old
python sync_cnip.py > %cnip_file%
for %%I in ("%cnip_file%") do set filesize=%%~zI
if %filesize%==0 (
    del /F /Q %cnip_file%
    ren %cnip_file%_old %cnip_file% 
) else (
    python convert.py > %proxy_file%
    type pac_code.js >> %proxy_file%
    echo PAC file generated successfully: %proxy_file%
)

if not exist pac_bak mkdir pac_bak

for /F "tokens=1" %%i in ('echo %date:/=_%') do set datestr=%%i
if exist %proxy_file% (
    7z.exe a -t7z %source%pac_bak\%proxy_file%.%datestr%.7z %proxy_file% 2>nul
    if exist %target%%proxy_file% (
        if not "%source%"=="%target%" (
            xcopy /S /I /Q /Y /F %source%%proxy_file% %target%%proxy_file%
        )
    )
)
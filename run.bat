@echo off
set source=c:\auto_pac\
set target=c:\www\
set cnip_file=chn_ip.txt
set proxy_file=proxy.pac

cd %source%
python sync_cnip.py > %cnip_file%
python convert.py > %proxy_file%
type pac_code.js >> %proxy_file%


for /F "tokens=1" %%i in ('echo %date:/=_%') do set datestr=%%i

echo F|xcopy /I /Q /Y /F %target%%proxy_file% %source%pac_bak\%proxy_file%.%datestr%.bak
xcopy /S /I /Q /Y /F %source%%proxy_file% %target%%proxy_file%
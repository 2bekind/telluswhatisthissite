@echo off
cd /d "%~dp0"
echo Установка зависимостей...
npm install
echo.
echo Запуск сервера на порту 3000...
echo Откройте http://localhost:3000 в браузере
echo.
npm start
pause

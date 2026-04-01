@echo off
echo Starting Kinara frontend and backend...

start "Kinara Backend" cmd /k "cd /d C:\New folder\Handmade Products Marketplace App 1902\backend && npm start"
start "Kinara Frontend" cmd /k "cd /d C:\New folder\Handmade Products Marketplace App 1902 && npm run dev"

echo Both services are launching in separate windows.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
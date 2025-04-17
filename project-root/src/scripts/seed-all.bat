//src/scripts/seed-all.bat
//toRun: ./src/scripts/seed-all.bat

@echo off
node src/scripts/seed-admin.cjs
node src/scripts/seed-movie.cjs
node src/scripts/seed-show.mjs
pause
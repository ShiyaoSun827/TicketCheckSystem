REM Description: This script seeds the database with initial data for admin, movie, and show.
@echo off
node src/scripts/seed-admin.cjs
node src/scripts/seed-movie.cjs
node src/scripts/seed-show.mjs
pause
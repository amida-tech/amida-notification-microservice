This project uses babel to compile javascript that utilizes the latest features back to a version of javascript that node supports.

Fortify can't handle the javascript before it is compiled so the fortify.sh script uses gulp to compile everything and then runs
sourceanalyzer on the dist/ directory.

If you need to find the line in the original file that corresponds to a line in a compiled file,
use sourcemaptool.js.

var sourceMap = require('source-map');
var fs = require('fs');

if (process.argv.length != 5) {
	console.log('USAGE: node sourcemaptool.js /path/to/bundle.js rowNum colNum');
	process.exit(-1);
	
}

var bundle = process.argv[2];
var row = process.argv[3];
var col = process.argv[4];
fs.readFile(bundle, 'utf8', function (err, data) {
	new sourceMap.SourceMapConsumer(data).then(function (smc) {
		console.log(smc.originalPositionFor({
			line: parseInt(row),
			column: parseInt(col)
		}));
		
		smc.destroy();
	});

});

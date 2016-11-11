var fs = require('fs');
var flags = require('flags');
var colors = require('colors');

//Define flags
flags.defineString('source', null, 'Source csv-file');
flags.defineString('input', null, 'Input CSV files (in json)');
flags.defineString('output', null, 'Output file');
flags.defineString('action', 'join', 'Method (join, subtract)');

flags.defineString('s', null, 'shortcut for source');
flags.defineString('i', null, 'shortcut for input');
flags.defineString('o', null, 'shortcut for output');
flags.defineString('a', 'join', 'shortcut for action');

flags.parse();

//Get arguments
var source = (flags.get('s') == null ? flags.get('source') : flags.get('s'));
var input = (flags.get('i') == null ? flags.get('input') : flags.get('i'));
var output = (flags.get('o') == null ? flags.get('output') : flags.get('o'));
var action = (flags.get('a') == 'join' ? flags.get('action') : flags.get('a'));

if (source == null || input == null || output == null) {
    console.log(colors.red('Source, input and output must be supplied..'));
    process.exit(0);
}

var CSVParser = function() {
    var self = this; 

    this.source = null;
    this.input = null;

    this.setSource = function(src) {
        self.source = fs.readFileSync(src).toString();
        self.source = self.source.split('\n');
        console.log(JSON.stringify(self.source));
    }

    this.setInput = function(inp) {
        self.input = fs.readFileSync(inp).toString();
    }

    //end CSVParser 
}

var parser = new CSVParser(); 
parser.setSource(source);
parser.setInput(input);
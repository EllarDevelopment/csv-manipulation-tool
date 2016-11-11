var fs = require('fs');
var flags = require('flags');
var colors = require('colors');
var validator = require("email-validator");


//Define flags
flags.defineString('source', null, 'Source csv-file');
flags.defineString('input', null, 'Input CSV files (in json)');
flags.defineString('target', "email", 'The header-field to target. E.g. "email".');
flags.defineString('output', null, 'Output file');
flags.defineString('action', 'join', 'Method (join, subtract)');

flags.defineBoolean('avoid_lowercase');


flags.defineString('s', null, 'shortcut for source');
flags.defineString('i', null, 'shortcut for input');
flags.defineString('t', null, 'shortcut for target');
flags.defineString('o', null, 'shortcut for output');
flags.defineString('a', 'join', 'shortcut for action');

flags.parse();

 

//Get arguments
var source = (flags.get('s') == null ? flags.get('source') : flags.get('s'));
var input = (flags.get('i') == null ? flags.get('input') : flags.get('i'));
var target = (flags.get('t') == null ? flags.get('target') : flags.get('t'));
var output = (flags.get('o') == null ? flags.get('output') : flags.get('o'));
var action = (flags.get('a') == 'join' ? flags.get('action') : flags.get('a'));

if (source == null || input == null || output == null) {
    console.log(colors.red('Source, input and output must be supplied..'));
    process.exit(0);
}

var CSVParser = function() {
    var self = this; 

    this.header = null;
    this.sourceDelim = null;

    this.target = null;
    this.source = null;
    this.input = null;
    this.inputField = 0;

    this.action = null;
    this.output = null;

    this.stats = {
        added: 0,
        subtracted: 0
    };

    this.setTarget = function(trg) {
        self.target = trg;
    }

    this.setSource = function(src) {
        self.source = fs.readFileSync(src).toString();
        var delimeter = (self.source.indexOf('\n\r') != -1 ? '\n\r' : '\n');
        self.source = self.source.split(delimeter);

        //Preserve header and delim, and remove it from source.
        self.header = self.source[0].toString();
        self.sourceDelim = delimeter;
        self.source.splice(0,1);
    }

    this.setInput = function(inp) {
        self.input = fs.readFileSync(inp).toString();
        var delimeter = (self.input.indexOf('\n\r') != -1 ? '\n\r' : '\n');
        self.input = self.input.split(delimeter);

        //Determine the target... 
        var header = self.input[0];
        header = header.split(',');
        for (var i = 0; i < header.length; i++) {
            var head = header[i].toLowerCase().trim();
            if (head == self.target) {
                self.inputField = i;
                break;
            }
        }

        //Remove header
        self.input.splice(0,1);



    }

    this.setAction = function(act) {
        self.action = act; 
    }

    this.setOutput = function(outputFile) {
        self.output = outputFile;
    }



    this.start = function() {

        //Lowercase-process
        if (!flags.get('avoid_lowercase')) {
            self.lowercase();
        }

        if (self.action.toLowerCase() == 'join') {
            self.join();
        } else if (self.action.toLowerCase() == 'subtract') {
            self.subtract(); 
        } else {
            console.log(colors.red('No valid action specified.'));
            process.exit(0);
        }

        //end start
    }

    this.summary = function() {
        console.log('-------------------------------');
        console.log(colors.cyan('MODIFICATIONS COMPLETED!'));
        console.log('-------------------------------');
        console.log(colors.magenta('Added: ') + self.stats.added);
        console.log(colors.magenta('Subtracted: ') + self.stats.subtracted);

        this.writeOutput();
    }

    this.writeOutput = function() {

        var outputStr = self.header;
        
        console.log("Building output...");

        for (var i = 0; i < self.source.length; i++) {
            var row = self.source[i];
            outputStr += self.sourceDelim + row;
        }

        console.log("Done, writing file...");
        fs.writeFileSync(self.output, outputStr);
        console.log('Done: ' + self.output);

        //end output
    }


    this.lowercase = function() {
        console.log('Starting ' + colors.cyan('lowercase-process.'));

        console.log(colors.cyan('lowercase-process') + ' on: ' + colors.yellow('source'));
        for (var i = 0; i < self.source.length; i++) {
            self.source[i] = self.source[i].toLowerCase();
        }

        console.log(colors.cyan('lowercase-process') + ' on: ' + colors.yellow('input'));
        for (var i = 0; i < self.input.length; i++) {
            self.input[i] = self.input[i].toLowerCase();
        }
    }

    this.join = function() {

        var target = self.target.toLowerCase();    

        for (var i = 0; i < self.input.length; i++) {

            try {

                var row = self.input[i];
                var cols = row.split(',');

                var col = cols[self.inputField].trim();

                 
                //Validate email 
                if (target == 'email' || target == 'e-mail' || target == 'mail') {

                    if (!validator.validate(col)) {
                        console.log(colors.yellow.bold("!! Invalid e-mail: " + col + " !!"));
                        continue;
                    }

                }    
        
                //Add
                if (self.source.indexOf(col) == -1) {
                    self.source.push(col);
                    console.log(colors.green('Adding ' + col));
                    self.stats.added++;
                    continue;
                }
            } catch (err) {
                console.log(colors.yellow.bold("!! Error processing " + col + " !!"));
                continue;
            }

            //end loop
        }

        this.summary();

        //end join-action
    }

    this.subtract = function() {

        var target = self.target.toLowerCase();    

        for (var i = 0; i < self.input.length; i++) {

            try {

                var row = self.input[i];
                var cols = row.split(',');

                var col = cols[self.inputField].trim();

                //Remove
                if (self.source.indexOf(col) != -1) {
                    
                    var position = self.source.indexOf(col); 
                    self.source.splice(position, 1); //Remove element. 

                    console.log(colors.blue('Subtracting ' + col));
                    self.stats.subtracted++;
                    continue;
                }

            } catch (err) {
                console.log(colors.yellow.bold("!! Error processing " + col + " !!"));
                continue;
            }

            //end loop
        }

        this.summary();

        //end subtract-action
    }

    //end CSVParser 
}

var parser = new CSVParser();
parser.setTarget(target); 
parser.setSource(source);
parser.setInput(input);
parser.setAction(action);
parser.setOutput(output);
parser.start(); 
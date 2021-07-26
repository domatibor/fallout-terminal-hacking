const ProcessArgvParser = require('./process-argv-parser');
const Terminal = require('./terminal');
const WORDS = require('./words');

const KEYS = {
    NewLine: '\u000d',
    EndOfText: '\u0003'
};
const STD_IN = process.stdin;
const STD_OUT = process.stdout;


const processArgvParser = new ProcessArgvParser('Fallout Terminal Hacking', 'Fallout 4 inspired terminal hacking game.');
processArgvParser
    .registerCommand('size', 's', 'How many special characters should be in the text.', 'number')
    .registerCommand('level', 'l', '', 'string')
    .registerCommand('method', 'm', '', 'string')
    .registerCommand('attempts', 'a', 'Specify the number of times the user can try to crack the password.', 'number')
    .init();

const terminal = new Terminal(WORDS, processArgvParser.findCommandByNameOrAlias('size').value || 1000);

// Configure stdin
STD_IN.setRawMode(true);
STD_IN.resume();
STD_IN.setEncoding('utf-8');

// Init the terminal
STD_OUT.write(terminal.prompt);

STD_IN.on('data', function (key) {

    if (key === KEYS.EndOfText) {
        process.exit();
    }

    if (key === KEYS.NewLine) {

        const result = terminal.onSubmit();
        STD_OUT.write(result.printOut);

        if (result.endProcess) {
            process.exit();
        }

        terminal.resetInput();

        return;

    }

    terminal.input = key;

    // write the key to stdout all normal like
    STD_OUT.write(key);

});

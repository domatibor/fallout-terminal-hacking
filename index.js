const KEYS = {
    NewLine: '\u000d',
    EndOfText: '\u0003'
};
const STD_IN = process.stdin;
const STD_OUT = process.stdout;
const WORDS = [
    'drown',
    'whole',
    'check',
    'upset',
    'flash',
    'prize',
    'charm',
    'match',
    'guess',
    'climb'
];

const Terminal = require('./terminal');
const TERMINAL = new Terminal(WORDS);

// Configure stdin
STD_IN.setRawMode(true);
STD_IN.resume();
STD_IN.setEncoding('utf-8');

// Init the terminal
STD_OUT.write(TERMINAL.prompt);

STD_IN.on('data', function (key) {

    if (key === KEYS.EndOfText) {
        process.exit();
    }

    if (key === KEYS.NewLine) {

        const result = TERMINAL.onSubmit();
        STD_OUT.write(result.printOut);

        if (result.endProcess) {
            process.exit();
        }

        TERMINAL.resetInput();

        return;

    }

    TERMINAL.input = key;

    // write the key to stdout all normal like
    STD_OUT.write(key);

});

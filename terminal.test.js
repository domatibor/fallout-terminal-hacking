const Terminal = require('./terminal');
const WORDS = require('./words');

describe('Terminal class unit tests', function () {

    test('Terminal should be created', function () {
        const terminal = new Terminal(WORDS);
        expect(terminal).toBeDefined();
        expect(terminal).toBeInstanceOf(Terminal);
    });

    test('Hamming distance of foo and bar should be 3', function () {
       const terminal = new Terminal(WORDS);
       expect(terminal.hammingDistance('foo', 'bar')).toEqual(3);
    });

    test('Hamming distance of foo and foo should be 0', function () {
        const terminal = new Terminal(WORDS);
        expect(terminal.hammingDistance('foo', 'foo')).toEqual(0);
    });

    test('Hamming distance of foo and fizz should be throw an error', function () {
        const terminal = new Terminal(WORDS);
        // Note: You must wrap the code in a function, otherwise the error will not be caught and the assertion will fail.
        expect(() => terminal.hammingDistance('foo', 'fizz')).toThrowError();
    });

    test('Hamming distance of foo and 123 should be throw an error', function () {
        const terminal = new Terminal(WORDS);
        expect(() => terminal.hammingDistance('foo', 123)).toThrowError();
    });

    test('Levenshtein distance of foo and bar should be 3', function () {
        const terminal = new Terminal(WORDS);
        expect(terminal.levenshteinDistance('foo', 'bar')).toEqual(3);
    });

    test('Levenshtein distance of foo and foo should be 0', function () {
        const terminal = new Terminal(WORDS);
        expect(terminal.levenshteinDistance('foo', 'foo')).toEqual(0);
    });

    test('Levenshtein distance of foo and fizz should be 3', function () {
        const terminal = new Terminal(WORDS);
        // Note: You must wrap the code in a function, otherwise the error will not be caught and the assertion will fail.
        expect(terminal.levenshteinDistance('foo', 'fizz')).toEqual(3);
    });

    test('Levenshtein distance of kitten and sitting should be 3', function () {
        const terminal = new Terminal(WORDS);
        // Note: You must wrap the code in a function, otherwise the error will not be caught and the assertion will fail.
        expect(terminal.levenshteinDistance('kitten', 'sitting')).toEqual(3);
    });

    test('Levenshtein distance of Saturday and Sunday should be 3', function () {
        const terminal = new Terminal(WORDS);
        // Note: You must wrap the code in a function, otherwise the error will not be caught and the assertion will fail.
        expect(terminal.levenshteinDistance('Saturday', 'Sunday')).toEqual(3);
    });

    test('Levenshtein distance of foo and 123 should be throw an error', function () {
        const terminal = new Terminal(WORDS);
        expect(() => terminal.levenshteinDistance('foo', 123)).toThrowError();
    });

    test('Should give an item form array [foo, bar, fizz, buzz]', function () {
        const terminal = new Terminal(WORDS);
        const array = ['foo', 'bar', 'fizz', 'buzz'];
        expect(array).toContain(terminal.getRandomItem(array));
    });

    test('Should give a random letter form string foo', function () {
        const terminal = new Terminal(WORDS);
        expect('foo').toContain(terminal.getRandomItem('foo'));
    });

    test('Password leak string should be contain all the given words', function () {
        const terminal = new Terminal(WORDS);
        // Case sensitive global regex that extract the words from password leak string
        const regex = new RegExp(WORDS.join('|'), 'gi');
        const extractedWords = terminal.prompt.toLowerCase().match(regex);
        expect(extractedWords).toEqual(WORDS);
    });

    test.each(WORDS)('The word %j, is appears in prompt', function (fixture) {
        const terminal = new Terminal(WORDS);
        expect(terminal.prompt).toMatch(fixture.toUpperCase());
    })

    test('Should give back the input string in upper case', function () {
       const terminal = new Terminal(WORDS);
       terminal.input = 'foo';
       expect(terminal.input).toEqual('FOO');
    });

    test('Should reset the input string', function () {
        const terminal = new Terminal(WORDS);
        terminal.input = 'foo';
        expect(terminal.input).toEqual('FOO');
        terminal.resetInput();
        expect(terminal.input).toEqual('');
    });

    test('Should return "Levenshtein distance is [0]"', function () {
       const terminal = new Terminal(WORDS);
       terminal.input = terminal.password;
       expect(terminal.levenshteinDistanceValue).toEqual('Levenshtein distance is [0]');
    });

    test('Should return "Hamming distance is [0]"', function () {
        const terminal = new Terminal(WORDS);
        terminal.input = terminal.password;
        expect(terminal.hammingDistanceValue).toEqual('Hamming distance is [0]');
    });

    test('Should return "Hamming distance cannot be calculated."', function () {
        const terminal = new Terminal(WORDS);
        terminal.input = '';
        expect(terminal.hammingDistanceValue).toEqual('Hamming distance cannot be calculated.');
    });
});

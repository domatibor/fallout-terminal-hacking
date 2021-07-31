/**
 * @param words {string[]}
 * @param size {number}
 * @constructor
 */
function Terminal(words, size = 1000) {
    this.words = words;
    this.size = size;
    this._input = [];
    this.password = this.getRandomItem(this.words).toUpperCase();
}

Object.defineProperty(Terminal.prototype, 'prompt', {

    /**
     * @return {string}
     */
    get: function () {

        const words = this.words.map(word => word.toUpperCase());
        const specialCharacters = '~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\?-_';
        const timeToTheNextWord = (i) => (i % (this.size / words.length)) === 0;
        let passwordLeakString = '';
        let index = 0;

        for (let i = 0; i < this.size; i++) {
            if (timeToTheNextWord(i)) {
                passwordLeakString += words[index].toUpperCase();
                index++;
                continue;
            }
            passwordLeakString += this.getRandomItem(specialCharacters);
        }

        return [
            '\n\x1b[34mWelcome to ROBCO Industries (TM) Termlink\x1b[0m',
            '\nPassword Required',
            '\n-----------------' +
            '\x1b[33m', `\n${passwordLeakString}`, '\x1b[0m',
            '\n']
            .join('');
    }
});

Object.defineProperty(Terminal.prototype, 'input', {

    /**
     * @param key {string}
     */
    set: function (key) {
        this._input.push(key);
    },

    /**
     * @return {string}
     */
    get: function() {
        return this._input.join('').toUpperCase();
    }
});

Object.defineProperty(Terminal.prototype, 'levenshteinDistanceValue', {

    /**
     * @return {string}
     */
    get: function () {

        try {
            const ld = this.levenshteinDistance(this.input, this.password);
            return `Levenshtein distance is [${ld}]`;

        } catch (e) {
            // this.input getter give back a string in every case, so this branch will never run
            // return 'Levenshtein distance cannot be calculated.';
        }
    }
});

Object.defineProperty(Terminal.prototype, 'hammingDistanceValue', {

    /**
     * @return {string}
     */
    get: function () {

        try {
            const ld = this.hammingDistance(this.input, this.password);
            return `Hamming distance is [${ld}]`;

        } catch (e) {
            return 'Hamming distance cannot be calculated.';
        }
    }
});

Terminal.prototype.resetInput = function () {
    this._input = [];
}

Terminal.prototype.onSubmit = function () {

    if (this.input === this.password) {
        return {
            printOut: [
                '\x1b[32m%s\x1b[0m',
                '\n>> Congratulation. You broke the password!'],
            endProcess: true
        };
    }

    return {
        printOut: [
            '\x1b[31m%s\x1b[0m',
            '\n>> Incorrect password.',
            `\n${this.levenshteinDistanceValue}\n${this.hammingDistanceValue}\n`],
        endProcess: false
    };

}

/**
 * The hamming distance between two strings of equal length is the number of positions at which these strings vary.
 * In more technical terms, it is a measure of the minimum number of changes required to turn one string into another.
 *
 * @param a {string}
 * @param b {string}
 * @return {number}
 */
Terminal.prototype.hammingDistance = function (a, b) {

    if (typeof a !== 'string' || typeof b !== 'string') {
        throw new Error('The Hamming distance can only be calculated between two strings.');
    }

    if (a.length !== b.length) {
        throw new Error('Strings do not have equal length.');
    }

    let result = 0;

    for (let i = 0; i < a.length; i++) {
        if (a.charAt(i) !== b.charAt(i)) {
            result++;
        }
    }

    return result;

}

/**
 * The Levenshtein distance is a string metric for measuring the difference between two sequences.
 * Informally, the Levenshtein distance between two words is the minimum number of single-character edits
 * (insertions, deletions or substitutions) required to change one word into the other.
 * https://en.wikipedia.org/wiki/Levenshtein_distance
 *
 * @param a {string}
 * @param b {string}
 * @return {number}
 */
Terminal.prototype.levenshteinDistance = function (a, b) {

    if (typeof a !== 'string' || typeof b !== 'string') {
        throw Error('The Levenshtein distance can only be calculated between two strings.');
    }

    if (a.length === 0) {
        return b.length;
    }

    if (b.length === 0) {
        return a.length;
    }

    const matrix = [];

    /*
     * Increment along the first column of each row.
     *
     * a {foo}, b {bar}
     * | - | - | f | o | o |
     * | - | 0 |   |   |   |
     * | b | 1 |   |   |   |
     * | a | 2 |   |   |   |
     * | r | 3 |   |   |   |
     */
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    /*
     * Increment each column in the first row.
     * a {foo}, b {bar}
     *
     * | - | - | f | o | o |
     * | - | 0 |(1)|(2)|(3)|
     * | b | 1 |   |   |   |
     * | a | 2 |   |   |   |
     * | r | 3 |   |   |   |
     */
    for (let i = 0; i <= a.length; i++) {
        matrix[0][i] = i;
    }

    /*
     * Fill in the rest of the matrix.
     * a {foo}, b {bar}
     *
     * | - | - | f | o | o |
     * | - | 0 | 1 | 2 | 3 |
     * | b | 1 |(0)|(0)|(0)|
     * | a | 2 |(0)|(0)|(0)|
     * | r | 3 |(0)|(0)|(0)|
     */
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                const substitution = matrix[i-1][j-1] + 1;
                const insertion = matrix[i][j-1] + 1;
                const deletion = matrix[i-1][j] + 1;
                matrix[i][j] = Math.min(substitution, Math.min(insertion, deletion));
            }
        }
    }

    /*
     * Return the matrix last element
     * a {foo}, b {bar}
     *
     * | - | - | f | o | o |
     * | - | 0 | 1 | 2 | 3 |
     * | b | 1 | 0 | 0 | 0 |
     * | a | 2 | 0 | 0 | 0 |
     * | r | 3 | 0 | 0 |(0)|
     */
    return matrix[b.length][a.length];

}

/**
 * @param s {string}
 * @return {string}
 */
Terminal.prototype.convertStringToUnicode = function (s) {
    let string = '';
    for (let i = 0; i < s.length; i++) {
        let unicode = s.charCodeAt(i).toString(16).toUpperCase();
        while (unicode.length < 4) {
            unicode = '0' + unicode;
        }
        unicode = '\\u' + unicode;
        string += unicode;
    }
    return string;
}

/**
 * @param items {string|string[]}
 * @return {string}
 */
Terminal.prototype.getRandomItem = function (items) {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

module.exports = Terminal;

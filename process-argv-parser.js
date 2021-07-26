/**
 * @param app {string}
 * @param description {string}
 * @constructor
 */
function ProcessArgvParser(app, description) {
    this.app = app;
    this.description = description;
    this.commands = [];
}

/**
 * @param name {string}
 * @param alias {string}
 * @param description {null|string}
 * @param type {'string'|'number'}
 * @param value {null|string|number}
 * @param options {null|string[]}
 * @return {ProcessArgvParser}
 */
ProcessArgvParser.prototype.registerCommand = function (name, alias, description, type, value = null, options = null) {
    this.commands.push({name, alias, description, type, value});
    return this;
}

/**
 * @param name {string}
 * @return {object}
 */
ProcessArgvParser.prototype.findCommandByNameOrAlias = function (name) {
    return this.commands.find(command => {
        const serializedName = this.serializeCommandName(name);
        return command.name === serializedName || command.alias === serializedName;
    });
}

/**
 * Removes hyphens (-) from the beginning of the command's name
 *
 * @param name {string}
 * @return {string}
 */
ProcessArgvParser.prototype.serializeCommandName = function (name) {
    return name.replace(new RegExp(/^-{1,2}/), '');
}

ProcessArgvParser.prototype.init = function () {

    const arguments = process.argv.splice(2);

    if (arguments.includes('--help')) {
        console.log('\x1b[36m%s\x1b[0m', `### ${this.app}`);
        console.log(`${this.description}\nCommands:`);
        console.log(this.commands.map(c => `--${c.name} [-${c.alias}] - ${c.description}`).join('\n'));
        process.exit();
    }

    let currentCommand;

    for (let arg of arguments) {

        // If it is a command with value (--foo=bar, -f=bar)
        if (new RegExp(/^-{1,2}.*=.*/).test(arg)) {
            const [name, value] = arg.split('=');
            const command = this.findCommandByNameOrAlias(name);
            if (!command) {
                return;
            }
            command.value = value;
            continue;
        }

        // If it is a command without value (--foo, -f)
        if (new RegExp(/^-{1,2}.*/).test(arg)) {
            const command = this.findCommandByNameOrAlias(arg);
            if (!command) {
                return;
            }
            currentCommand = command;
            continue;
        }

        if (!currentCommand) {
            return;
        }

        // If it is a command's value
        currentCommand.value = arg;

    }
}

module.exports = ProcessArgvParser;

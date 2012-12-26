function Nut(server, port) {

    port = port || 6600;

    this.connect(server, port);

    return this;
}

Nut.prototype = {
    
    server: false,
    
    connect: function(server, port) {

        if(this.server)
            return;
        
        if(server === undefined) {

            this.message({
                type: 'error',
                text: 'Server is undefined'
            });
        }

        var net = require('net'),
            nut = Nut.prototype,
            onConnect = function() {
                nut.onConnect.call(this, nut);
            };

        return this.server = net.connect(port, server, onConnect);
    },

    message: function(message) {
        
        switch(message.type) {

            case 'error':
                console.error(new Error(message.text));
                return false;

            case 'warning':
                console.warn('[Warn:', message.text + ']');
                return true;

            case 'log':
                console.log('[Log:', message.text + ']');
                return true;
        }
    },

    onConnect: function(nut) {

        this.setEncoding('utf-8');
        
        this.on('data', function(data) {
            nut.onData(nut, data);
        });

        this.on('error', function(error) {

            nut.message({
                type: 'error',
                text: error
            });
        });

        var server = this;

        process.openStdin().on('data', function(command) {
            nut.onCommand.call(server, nut, command);
        });
    },

    onData: function(nut, data) {

        // Удаление перевода строки
        data = data.slice(0, -1);

        if(nut.isOk(data)) {
            
            nut.parseResult(data);
        } else {

            return nut.message({
                type: 'error',
                text: data
            });
        }
    },

    isOk: function(data) {

        return (data.match(/^OK/)) ? true : false;
    },

    parseResult: function(data) {


    },

    onCommand: function(nut, command) {
        
        var commandInfo = nut.parseCommand(command),
            method      = nut.commands[commandInfo[0]];

        return (method !== undefined) ?
            method.call(nut, this, commandInfo[1]) :
            nut.message({
                type: 'error',
                text: 'Method not found'
            });;
    },

    parseCommand: function(command) {

        var commandName = command.toString().split(/\s/).filter(String)[0],
            secondPart  = command.slice(commandName.length);

        commandVal = secondPart.toString().replace(/^\s+|\s+$/g, '');

        return [commandName, commandVal];
    },

    exec: function(command) {

        this.write(command + '\n');
    },

    commands: require('./commands')
};

module.exports = Nut;
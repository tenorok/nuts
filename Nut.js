var net = require('net');

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

        var nut = Nut.prototype,
            onConnect = function() {
                nut.onConnect.call(this, nut);
            };

        return this.server = net.connect(port, server, onConnect);
    },

    message: function(message) {
        
        switch(message.type) {

            case 'error':
                console.error(new Error(message.text));
                break;

            case 'warning':
                console.warn(message.text);
                break;

            case 'log':
                console.log(message.text);
                break;
        }
    },

    onConnect: function(nut) {

        this.setEncoding('utf-8');
        
        this.on('data', function(data) {
            
            nut.message({
                type: 'log',
                text: data.toString()
            });
        });

        this.on('error', function(error) {

            nut.message({
                type: 'error',
                text: error
            });
        });

        var server = this;

        process.openStdin().on('data', function(data) {
            nut.onCommand.call(server, data);
        });
    },

    onCommand: function(command) {

        this.write(command + '\n');
    }
};

module.exports = Nut;
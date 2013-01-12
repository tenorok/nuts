require('./prototype/array');

/**
 * Конструктор орешков
 * @param {String}   server     Адрес сервера
 * @param {Number}   [port]     Порт, по умолчанию 6600
 * @param {Function} callback   Функция, которая будет выполнена после подключения
 * @param {Object}   [settings] Настройки
 */
function Nut(server, port, callback, settings) {

    // Установка дефолтных значений для объекта настроек
    function setDefaultSettings(settings) {

        var defaultSettings = {
            print: false,
            a: false,
            b: false
        };

        if(settings === undefined)
            return defaultSettings;

        for(set in defaultSettings)
            settings[set] = settings[set] || defaultSettings[set];

        return settings;
    }
    
    settings = typeof(callback) === 'object'   && callback || settings;
    callback = typeof(port)     === 'function' && port     || callback;
    port     = typeof(port)     === 'number'   && port     || 6600;

    this.settings = setDefaultSettings(settings);
    this.connect(server, port, callback);

    return this;
}

Nut.prototype = {
    
    server: false,
    
    connect: function(server, port, callback) {

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

        nut.callback = callback;
        nut.settings = this.settings;

        return net.connect(port, server, onConnect);
    },

    close: function() {
        
        this.server.destroy();

        this.message({
            type: 'log',
            text: 'Connection closed'
        });
    },

    message: function(message) {
        
        switch(message.type) {

            case 'error':
                console.error(new Error(message.text));
                return false;

            case 'warning':
                console.warn('[ Warn:', message.text, ']');
                return true;

            case 'log':
                console.log('[ Log:', message.text, ']');
                return true;
        }
    },

    onConnect: function(nut) {

        nut.server = this;

        this.setEncoding('utf-8');

        nut.setParser('default');
        
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

        nut.callback.call(nut, this);
    },

    eventEmitter: require('events').EventEmitter.prototype,

    result: null,
    
    data: [],

    onData: function(nut, data) {

        // Удаление \n из конца строки, если он там есть
        data = data.search(/\n$/) && data.slice(0, -1);

        if(nut.isOK(data)) {
            
            nut.data.push(data);

            var finalData = nut.data.join(''),
                parser = nut.parser.shift();
            
            nut.data = [];

            nut.result = parser.func.call(nut, finalData)
            
            nut.eventEmitter.emit(parser.key);

            return nut.result;
        }
        else if(!nut.isACK(data)) {

            nut.data.push(data);
        }
        else {
            
            nut.parser.shift();

            return nut.message({
                type: 'error',
                text: data
            });
        }
    },

    parsers: require('./parser'),

    parser: [],

    setParser: function(method, command) {

        var key = (command || method) + Math.random();
        
        this.parser.push({
            key: key,
            func: this.parsers[method]
        });

        return key;
    },

    isOK: function(data) {

        return (data.search(/^OK|OK$/) < 0) ? false : true;
    },

    isACK: function(data) {

        return (data.search(/^ACK/) < 0) ? false : true;
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

    commands: require('./commands'),

    str2obj: function(data, n, keys) {

        var array = [];
        
        data.split('\n').split(n || 1).forEach(function(el) {

            array.push(toObj(el, keys || {}));
        });

        function toObj(el, keys) {

            var obj = {},
                info,
                key;
            
            el.forEach(function(el) {

                info = el.split(': ');

                key = info[0].toLowerCase();
                key = (keys[key] !== undefined) ? keys[key] : key;

                obj[key] = info[1];
            });

            return obj;
        }

        return array;
    },

    cmds: [],

    cmd: function(command) {
        
        var isCallback = Array.prototype.slice.call(arguments, -1)[0],
            callback   = (typeof(isCallback) === 'function') ? isCallback : undefined,

            params     = Array.prototype.slice.call(arguments, 1, callback ? -1 : arguments.length),

            key,
            that = this;

        this.cmds.push({
            command: command,
            params: params,
            callback: callback
        });

        if(this.cmds.length == 1) {
            
            key = call(command, params);
            bind(key, callback);
        }
        
        function bind(key, callback) {

            that.eventEmitter.on(key, function() {

                if(that.settings.print)
                    that.message({
                        type: 'log',
                        text: that.result
                    });

                if(callback !== undefined)
                    callback.call(that, that.result);

                that.cmds.shift();

                var nextCmd = that.cmds[0];

                if(nextCmd !== undefined) {

                    key = call(
                        nextCmd.command,
                        nextCmd.params
                    );

                    bind(key, nextCmd.callback);
                }
            });
        }

        function call(command, params) {

            return that.commands[command].apply(
                that,
                [that.server].concat(params)
            );
        }

        return this;
    }
};

module.exports = Nut;
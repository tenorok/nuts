require('./prototype/array');

/**
 * Создаёт экземпляр орешков
 * @constructor
 * @this   {Nut}
 * @param  {String}   server     Адрес сервера
 * @param  {Number}   [port]     Порт, по умолчанию 6600
 * @param  {Function} callback   Функция, выполняющаяся после подключения
 * @param  {Object}   [settings] Настройки
 * @return {Object}              Созданный объект
 */
function Nut(server, port, callback, settings) {

    /**
     * Установка дефолтных значений для объекта настроек
     * @private
     * @param  {Object} settings Объект настроек
     * @return {Object}          Преобразованный объект настроек
     */
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
    
    // Объект сервера
    server: false,
    
    /**
     * Подключение к серверу
     * @this   {Nut}
     * @param  {String}   server   Адрес сервера
     * @param  {Number}   port     Порт
     * @param  {Function} callback Функция, выполняющаяся после подключения
     * @return {Object}            Объект сервера
     */
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

    /**
     * Отключение от сервера
     * @this {Nut}
     * @return {true} При успешном закрытии соединения возвращается true
     */
    close: function() {
        
        this.server.destroy();

        return this.message({
            type: 'log',
            text: 'Connection closed'
        });
    },

    /**
     * Печать сообщения
     * @this     {Nut}
     * @param    {Object}  message      Объект с информацией о сообщении
     * @property {String}  message.type Тип сообщения (error|warning|log)
     * @property {String}  message.text Текст сообщения
     * @return   {Boolean}              При ошибке возвращается false
     */
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

    /**
     * Установка обработчиков после подключения к серверу
     * @this   {Socket}
     * @param  {Object} nut Объект орешков
     */
    onConnect: function(nut) {

        nut.server = this;

        this.setEncoding('utf-8');

        nut.setParser('default');
        
        this.on('data', function(data) {
            
            nut.onData(data);
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

    // Подключение событийного модуля
    eventEmitter: require('events').EventEmitter.prototype,

    // Переменная для хранения результата выполнения команд
    result: null,
    
    // Массив хранения частей ответов на один запрос к серверу
    data: [],

    /**
     * Обработчик полученных от сервера данных
     * @this   {Nut}
     * @param  {String}       data Строка ответа сервера
     * @return {String|false}      Конечная строка ответа сервера или false в случае ошибки
     */
    onData: function(data) {

        // Удаление \n из конца строки, если он там есть
        data = data.search(/\n$/) && data.slice(0, -1);

        if(this.isOK(data)) {
            
            this.data.push(data);

            var finalData = this.data.join(''),
                parser = this.parser.shift();
            
            this.data = [];

            this.result = parser.func.call(this, finalData)
            
            this.eventEmitter.emit(parser.key);

            return this.result;
        }
        else if(!this.isACK(data)) {

            this.data.push(data);
        }
        else {
            
            this.parser.shift();

            return this.message({
                type: 'error',
                text: data
            });
        }
    },

    // Подключение объекта парсеров
    parsers: require('./parser'),

    // Очередь парсеров
    parser: [],

    /**
     * Установка текущего парсера
     * @this   {Nut}
     * @param  {String} parser    Имя парсера
     * @param  {String} [command] Имя команды
     * @return {String}           Случайно сгенерированное имя события
     */
    setParser: function(parser, command) {

        var key = (command || parser) + Math.random();
        
        this.parser.push({
            key: key,
            func: this.parsers[parser]
        });

        return key;
    },

    /**
     * Проверка на положительный ответ сервера
     * @this   {Nut}
     * @param  {String}  data Строка ответа сервера
     * @return {Boolean}
     */
    isOK: function(data) {

        return (data.search(/^OK|OK$/) < 0) ? false : true;
    },

    /**
     * Проверка на отрицательный ответ сервера
     * @this   {Nut}
     * @param  {String}  data Строка ответа сервера
     * @return {Boolean}
     */
    isACK: function(data) {

        return (data.search(/^ACK/) < 0) ? false : true;
    },

    /**
     * Реакция на ввод команды с клавиатуры
     * @this   {Socket}
     * @param  {Object} nut     Объект орешков
     * @param  {String} command Введённый текст
     * @return {String|false}   Случайно сгенерированное имя события или false в случае ошибки
     */
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

    /**
     * Разбор отправленной с клавиатуры строки
     * @this   {Nut}
     * @param  {String} command Введённый текст
     * @return {Array}          [Команда, Параметры]
     */
    parseCommand: function(command) {

        var commandName = command.toString().split(/\s/).filter(String)[0],
            secondPart  = command.slice(commandName.length);

        commandVal = secondPart.toString().replace(/^\s+|\s+$/g, '');

        return [commandName, commandVal];
    },

    /**
     * Отправка команды серверу
     * @this   Socket
     * @param  {String} command Полный текст команды
     */
    exec: function(command) {

        this.write(command + '\n');
    },

    // Подключение объекта команд
    commands: require('./commands'),

    /**
     * Преобразование строки в JSON
     * @this   {Nut}
     * @param  {String} data Ответ сервера
     * @param  {Number} n    Количество свойств для одного элемента выборки
     * @param  {Object} keys Хеш соответствий ключей (mpd_key: my_key)
     * @return {JSON}        Ответ сервера в формате JSON
     */
    str2obj: function(data, n, keys) {

        var array = [];
        
        data.split('\n').split(n || 1).forEach(function(el) {

            array.push(toObj(el, keys || {}));
        });

        /**
         * Преобразование отдельного элемента-массива в объект
         * @private
         * @param  {Array}  el   Отдельный элемент-массив
         * @param  {Object} keys Хеш соответствий ключей (mpd_key: my_key)
         * @return {Object}      Сформированный объект
         */
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

    // Очередь команд
    cmds: [],

    /**
     * Выполнение команд из приложения
     * @this        {Nut}
     * @param       {String}        command Имя команды
     * @args[1, -1] {String|Number}         Параметры команды
     * @args[-1]    {Function}              Колбек
     * @return      {Object}                Объект орешков
     */
    cmd: function(command) {
        
        var isCallback = Array.prototype.slice.call(arguments, -1)[0],
            callback   = (typeof(isCallback) === 'function') ? isCallback : undefined,

            params     = Array.prototype.slice.call(arguments, 1, callback ? -1 : arguments.length),

            key;

        this.cmds.push({
            command: command,
            params: params,
            callback: callback
        });

        if(this.cmds.length == 1) {
            
            key = send.call(this, command, params);
            bind.call(this, key, callback);
        }
        
        /**
         * Установка обработчика события
         * @private
         * @this   {Nut}
         * @param  {String}   key      Случайно сгенерированное имя события
         * @param  {Function} callback Функция, которая будет выполнена при возникновении события
         */
        function bind(key, callback) {

            var that = this;

            this.eventEmitter.on(key, function() {

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

                    key = send.call(
                        that,
                        nextCmd.command,
                        nextCmd.params
                    );

                    bind.call(that, key, nextCmd.callback);
                }
            });
        }

        /**
         * Отправка команды на выполнение
         * @private
         * @this   {Nut}
         * @param  {String} command Имя команды
         * @param  {Array}  params  Массив параметров команды
         * @return {String}         Случайно сгенерированное имя события
         */
        function send(command, params) {

            return this.commands[command].apply(
                this,
                [this.server].concat(params)
            );
        }

        return this;
    }
};

module.exports = Nut;
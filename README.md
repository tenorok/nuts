# Nuts ― это инструмент для работы с MPD.

## Использование

Конструктор `Nut` принимает четыре аргумента:

- Обязательный. Адрес сервера;

- Порт, по умолчанию 6600;

- Обязательный. Колбек, исполняющийся после подключения к серверу. Получает входным параметром объект `Socket`. В качестве `this` имеет созданный объект `Nut`;

- Настройки.

```javascript
var Nut = require('./Nut.js');

new Nut('54.246.111.22', 6600, function(socket) {

    this
        .cmd('listplaylists', function(listplaylists) {
            console.log(listplaylists);
        })
        .cmd('listplaylist', 'second', function(listplaylists) {
            console.log(listplaylists);
            this.close();
        });
        
}, {
                    // В данном примере указаны значения по умолчанию
    print: false    // Выводить в терминале ответ сервера
});
```

Метод `cmd` используется для выполнения MPD-команд и получения результата в JSON-формате.

Первым аргументом всегда указывается имя MPD-команды. Далее могут следовать параметры указанной команды. И последним аргументом может быть передана колбек-функция, которая принимает единственный параметр ― результат выполнения команды в JSON-формате.

Команды можно записывать цепочкой.

## Команды

[Официальная документация по всем командам MPD.](http://mpd.wikia.com/wiki/MusicPlayerDaemonCommands)

Ниже перечислены команды, доступные к выполнению в Nuts.

В квадратных скобках указаны необязательные параметры, а в угловых ― обязательные. Команды, возвращающие результат в callback-функцию, предварены ключом `json`.


### Информационные команды

`json``status` ― текущее состояние MPD

`json``stats` ― показать статистику


### Управление базой данных

`json``find <type> <what>` ― найти треки в соответствии с условием (регистрозависимый поиск), например: find artist "Elvis Presley"

`json``listall` ― краткая информация по всем трекам

`json``listallinfo` ― подробная информация по всем трекам

`json``lsinfo` ― подробная информация по всем трекам и в конце результат `listplaylists`


### Управление плейлистами

`add <file>` ― добавить один файл в конец текущего плейлиста

`clear` ― удалить все треки из текущего плейлиста

`json``currentsong` ― информация о текущем проигрываемом треке

`deleteid <song id>` ― удалить трек из текущего плейлиста

`load <playlist>` ― добавить в конец текущего плейлиста треки указанного плейлиста

`json``listplaylists` ― список плейлистов

`rename <old name> <new name>` ― переименовать плейлист

`move <old position> <new position>` ― изменить позицию трека в текущем плейлисте

`moveid <song id> <position>` ― изменить позицию указанного трека в текущем плейлисте

`json``playlist` ― краткая информация по трекам текущего плейлиста

`json``playlistinfo` ― подробная информация по трекам текущего плейлиста

`json``playlistid <song id>` ― информация по указанному треку из текущего плейлиста

`rm <playlist>` ― удалить указанный плейлист

`save <playlist>` ― сохранить текущий плейлист под заданным именем

`shuffle` ― перемешать случайным образом треки текущего плейлиста

`json``listplaylist <playlist>` ― краткая информация по трекам указанного плейлиста

`json``listplaylistinfo <playlist>` ― подробная информация по трекам указанного плейлиста

`playlistclear <playlist>` ― удалить все треки из указанного плейлиста

`playlistdelete <playlist> <song id>` ― удалить указанный трек из указанного плейлиста

`playlistmove <playlist> <old position> <new position>` ― изменить позицию трека в указанном плейлисте


### Управление проигрыванием

`next` ― следующий трек

`pause [1|0]` ― пауза, по умолчанию является тумблером

`playid [song id]` ― проиграть трек с заданным id, по умолчанию id = 0

`previous` ― предыдущий трек

`random <1|0>` ― включить или выключить случайный порядок проигрывания

`repeat <1|0>` ― включить или выключить повторное проигрывание трека

`seekid <song id> <time>` ― перемотать указанный трек до указанной позиции (в секундах)

`setvol <vol>` ― установить уровень громкости от 0 до 100

`stop` ― стоп
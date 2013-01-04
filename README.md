# Nuts ― это инструмент для работы с MPD.

## Команды

[Официальная документация по всем командам MPD.](http://mpd.wikia.com/wiki/MusicPlayerDaemonCommands)

Ниже перечислены команды, доступные к выполнению в Nuts.

В квадратных скобках указаны необязательные параметры, а в угловых ― обязательные.


### Информационные команды

`status` ― текущее состояние MPD

`stats` ― показать статистику


### Управление базой данных

`find <type> <what>` ― найти треки в соответствии с условием (регистрозависимый поиск), например: find artist "Elvis Presley"

`listall` ― краткая информация по всем трекам

`listallinfo` ― подробная информация по всем трекам

`lsinfo` ― подробная информация по всем трекам и в конце результат `listplaylists`


### Управление плейлистами

`add <file>` ― добавить один файл в конец текущего плейлиста

`clear` ― удалить все треки из текущего плейлиста

`currentsong` ― информация о текущем проигрываемом треке

`deleteid <song id>` ― удалить трек из текущего плейлиста

`load <playlist>` ― добавить в конец текущего плейлиста треки указанного плейлиста

`listplaylists` ― список плейлистов

`rename <old name> <new name>` ― переименовать плейлист

`move <old position> <new position>` ― изменить позицию трека в плейлисте

`moveid <song id> <position>` ― изменить позицию указанного трека в плейлисте

`playlist` ― краткая информация по трекам текущего плейлиста

`playlistinfo` ― подробная информация по трекам текущего плейлиста

`playlistid <song id>` ― информация по указанному треку из текущего плейлиста

`rm <playlist>` ― удалить указанный плейлист

`save <playlist>` ― сохранить текущий плейлист под заданным именем

`shuffle` ― перемешать случайным образом треки текущего плейлиста

`listplaylist <playlist>` ― краткая информация по трекам указанного плейлиста

`listplaylistinfo <playlist>` ― подробная информация по трекам указанного плейлиста

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
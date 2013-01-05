module.exports = {


    // Информационные команды

    status: function(server) {
        this.exec.call(server, 'status');
        return this.setParser('tojson', 'status');
    },

    stats: function(server) {
        this.exec.call(server, 'stats');
        return this.setParser('tojson', 'stats');
    },


    // Управление базой данных
    
    find: function(server, type, what) {
        var target = (arguments.length > 2) ? type + ' "' + what + '"' : type;
        this.exec.call(server, 'find ' + target);
        return this.setParser('tojsoninfo', 'find');
    },

    listall: function(server, path) {
        this.exec.call(server, 'listall ' + path);
        return this.setParser('listall');
    },

    listallinfo: function(server, path) {
        this.exec.call(server, 'listallinfo ' + path);
        return this.setParser('tojsoninfo', 'listallinfo');
    },

    lsinfo: function(server) {
        this.exec.call(server, 'lsinfo');
        return this.setParser('lsinfo');
    },


    // Управление плейлистами
    
    add: function(server, file) {
        this.exec.call(server, 'add ' + file);
        this.setParser('default');
    },

    clear: function(server) {
        this.exec.call(server, 'clear');
        this.setParser('default');
    },

    currentsong: function(server) {
        this.exec.call(server, 'currentsong');
        return this.setParser('tojson', 'currentsong');
    },

    deleteid: function(server, id) {
        this.exec.call(server, 'deleteid ' + id);
        this.setParser('default');
    },

    load: function(server, name) {
        this.exec.call(server, 'load ' + name);
        this.setParser('default');
    },

    listplaylists: function(server) {
        this.exec.call(server, 'listplaylists');
        return this.setParser('listplaylists');
    },

    rename: function(server, oldName, newName) {
        var names = (arguments.length > 2) ? oldName + ' ' + newName : oldName;
        this.exec.call(server, 'rename ' + names);
        this.setParser('default');
    },

    move: function(server, oldPos, newPos) {
        var positions = (arguments.length > 2) ? oldPos + ' ' + newPos : oldPos;
        this.exec.call(server, 'move ' + positions);
        this.setParser('default');
    },

    moveid: function(server, oldPos, newPos) {
        var positions = (arguments.length > 2) ? oldPos + ' ' + newPos : oldPos;
        this.exec.call(server, 'moveid ' + positions);
        this.setParser('default');
    },

    playlist: function(server) {
        this.exec.call(server, 'playlist');
        return this.setParser('playlist');
    },

    playlistinfo: function(server) {
        this.exec.call(server, 'playlistinfo');
        return this.setParser('playlistinfo');
    },

    playlistid: function(server, id) {
        this.exec.call(server, 'playlistid ' + id);
        return this.setParser('tojson', 'playlistid');
    },

    rm: function(server, playlist) {
        this.exec.call(server, 'rm ' + playlist);
        this.setParser('default');
    },

    save: function(server, name) {
        this.exec.call(server, 'save ' + name);
        this.setParser('default');
    },

    shuffle: function(server) {
        this.exec.call(server, 'shuffle');
        this.setParser('default');
    },

    listplaylist: function(server, playlist) {
        this.exec.call(server, 'listplaylist ' + playlist);
        return this.setParser('tojson', 'listplaylist');
    },

    listplaylistinfo: function(server, playlist) {
        this.exec.call(server, 'listplaylistinfo ' + playlist);
        return this.setParser('tojsoninfo', 'listplaylistinfo');
    },

    playlistclear: function(server, playlist) {
        this.exec.call(server, 'playlistclear ' + playlist);
        this.setParser('default');
    },

    playlistdelete: function(server, playlist, songid) {
        var target = (arguments.length > 2) ? playlist + ' ' + songid : playlist;
        this.exec.call(server, 'playlistdelete ' + target);
        this.setParser('default');
    },

    playlistmove: function(server, playlist, oldPos, newPos) {
        var target = (arguments.length > 2) ? playlist + ' ' + oldPos + ' ' + newPos : playlist;
        this.exec.call(server, 'playlistmove ' + target);
        this.setParser('default');
    },

    
    // Управление проигрыванием

    next: function(server) {
        this.exec.call(server, 'next');
        this.setParser('default');
    },

    pause: function(server, mode) {
        this.exec.call(server, 'pause ' + mode);
        this.setParser('default');
    },
    
    playid: function(server, id) {
        this.exec.call(server, 'playid ' + id);
        this.setParser('default');
    },

    previous: function(server) {
        this.exec.call(server, 'previous');
        this.setParser('default');
    },

    random: function(server, state) {
        this.exec.call(server, 'random ' + state);
        this.setParser('default');
    },

    repeat: function(server, state) {
        this.exec.call(server, 'repeat ' + state);
        this.setParser('default');
    },

    seekid: function(server, songid, time) {
        var target = (arguments.length > 2) ? songid + ' ' + time : songid;
        this.exec.call(server, 'seekid ' + target);
        this.setParser('default');
    },

    setvol: function(server, vol) {
        this.exec.call(server, 'setvol ' + vol);
        this.setParser('default');
    },

    stop: function(server) {
        this.exec.call(server, 'stop');
        this.setParser('default');
    }
};
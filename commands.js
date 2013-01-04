module.exports = {


    // Информационные команды

    status: function(server) {
        this.exec.call(server, 'status');
        this.setParser('tojson');
    },

    stats: function(server) {
        this.exec.call(server, 'stats');
        this.setParser('tojson');
    },


    // Управление базой данных
    
    find: function(server, target) {
        this.exec.call(server, 'find ' + target);
        this.setParser('tojsoninfo');
    },

    listall: function(server, path) {
        this.exec.call(server, 'listall ' + path);
        this.setParser('listall');
    },

    listallinfo: function(server, path) {
        this.exec.call(server, 'listallinfo ' + path);
        this.setParser('tojsoninfo');
    },

    lsinfo: function(server) {
        this.exec.call(server, 'lsinfo');
        this.setParser('lsinfo');
    },


    // Управление плейлистами
    
    add: function(server, file) {
        this.exec.call(server, 'add ' + file);
    },

    clear: function(server) {
        this.exec.call(server, 'clear');
    },

    currentsong: function(server) {
        this.exec.call(server, 'currentsong');
        this.setParser('tojson');
    },

    deleteid: function(server, id) {
        this.exec.call(server, 'deleteid ' + id);
    },

    load: function(server, name) {
        this.exec.call(server, 'load ' + name);
    },

    listplaylists: function(server) {
        this.exec.call(server, 'listplaylists');
        this.setParser('listplaylists');
    },

    rename: function(server, names) {
        this.exec.call(server, 'rename ' + names);
    },

    move: function(server, target) {
        this.exec.call(server, 'move ' + target);
    },

    moveid: function(server, target) {
        this.exec.call(server, 'moveid ' + target);
    },

    playlist: function(server) {
        this.exec.call(server, 'playlist');
        this.setParser('playlist');
    },

    playlistinfo: function(server) {
        this.exec.call(server, 'playlistinfo');
        this.setParser('playlistinfo');
    },

    playlistid: function(server, id) {
        this.exec.call(server, 'playlistid ' + id);
        this.setParser('tojson');
    },

    rm: function(server, playlist) {
        this.exec.call(server, 'rm ' + playlist);
    },

    save: function(server, name) {
        this.exec.call(server, 'save ' + name);
    },

    shuffle: function(server) {
        this.exec.call(server, 'shuffle');
    },

    listplaylist: function(server, playlist) {
        this.exec.call(server, 'listplaylist ' + playlist);
        this.setParser('tojson');
    },

    listplaylistinfo: function(server, playlist) {
        this.exec.call(server, 'listplaylistinfo ' + playlist);
        this.setParser('tojsoninfo');
    },

    playlistclear: function(server, playlist) {
        this.exec.call(server, 'playlistclear ' + playlist);
    },

    playlistdelete: function(server, target) {
        this.exec.call(server, 'playlistdelete ' + target);
    },

    playlistmove: function(server, target) {
        this.exec.call(server, 'playlistmove ' + target);
    },

    
    // Управление проигрыванием

    next: function(server) {
        this.exec.call(server, 'next');
    },

    pause: function(server, mode) {
        this.exec.call(server, 'pause ' + mode);
    },
    
    playid: function(server, id) {
        this.exec.call(server, 'playid ' + id);
    },

    previous: function(server) {
        this.exec.call(server, 'previous');
    },

    random: function(server, state) {
        this.exec.call(server, 'random ' + state);
    },

    repeat: function(server, state) {
        this.exec.call(server, 'repeat ' + state);
    },

    seekid: function(server, target) {
        this.exec.call(server, 'seekid ' + target);
    },

    setvol: function(server, vol) {
        this.exec.call(server, 'setvol ' + vol);
    },

    stop: function(server) {
        this.exec.call(server, 'stop');
    }
};
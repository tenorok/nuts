module.exports = {

    default: function(data) {

        return this.message({
            type: 'log',
            text: data
        });
    },
    
    listplaylists: function(data) {

        return this.str2obj(data, 2, {
            'playlist': 'name',
            'last-modified': 'modified'
        });
    },

    playlist: function(data) {

        var tracks = [],
            track = {},
            info = data.split('\n'),
            duration,
            name;

        for(var t = 0, len = info.length - 1; t < len; t++) {
            
            duration = info[t].split(' ')[0];

            tracks.push({
                duration: duration,
                name: info[t].slice(duration.length + 1)
            });
        }

        return tracks;
    },

    playlistinfo: function(data) {

        return this.str2obj(data, 8);
    },

    listall: function(data) {

        var tracks = [],
            info = data.split('\n');

        for(var t = 0, len = info.length - 1; t < len; t++) {

            tracks.push(
                info[t].split('file: ')[1]
            );
        }

        return tracks;
    },

    lsinfo: function(data) {

        var filesEndPos = data.search('playlist: '),
            files       = this.str2obj(data.slice(0, filesEndPos), 6),
            playlists   = this.str2obj(data.slice(filesEndPos), 2);

        return [files, playlists];
    }
};
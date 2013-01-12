var Nut = require('./Nut.js');

new Nut('54.246.111.22', function(server) {

    this
        .cmd('listplaylists', function(result) {
            console.log(result);
        })
        .cmd('listplaylist', 'second', function(listplaylists) {
            console.log(listplaylists);
        })
        .cmd('listplaylist', 'testPlaylist', function(listplaylists) {
            console.log(listplaylists);
        })
        .cmd('find', 'artist', 'Elvis Presley', function(result) {
            console.log(result[0]);
            this.close();
        });
        
}, {
    // print: true
});
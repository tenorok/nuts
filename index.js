var Nut = require('./Nut.js');

new Nut('54.246.111.22', function(server) {

    this.cmd('listplaylists', function(result) {
        console.log(result);
    });
    
    this.cmd('listplaylist', 'second', function(listplaylists) {
        console.log(listplaylists);
    });

    this.cmd('listplaylist', 'testPlaylist', function(listplaylists) {
        console.log(listplaylists);
    });

    this.cmd('find', 'artist', 'Elvis Presley', function(result) {
        console.log(result[0]);
    });
}, {
    // print: true
});
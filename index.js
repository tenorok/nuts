var Nut = require('./Nut.js');

new Nut('54.246.111.22', function(server) {

    this.cmd(server, 'listplaylists', function(result) {
        console.log(result);
    });

    this.cmd(server, 'find', 'artist', 'Elvis Presley', function(result) {
        console.log(result[1]);
    });
});
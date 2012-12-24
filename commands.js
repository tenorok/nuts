module.exports = {

    playid: function(server, id) {
        this.exec.call(server, 'playid ' + id);
    },

    next: function(server) {
        this.exec.call(server, 'next');
    },

    previous: function(server) {
        this.exec.call(server, 'previous');
    },

    pause: function(server, mode) {
        this.exec.call(server, 'pause ' + mode);
    },

    stop: function(server) {
        this.exec.call(server, 'stop');
    }
};
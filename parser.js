module.exports = {

    default: function(data) {

        return this.message({
            type: 'log',
            text: data
        })
    },
    
    listplaylists: function(data) {

        console.log('helllllooo!!');
    }
};
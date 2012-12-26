Array.prototype.split = function(n) {
    
    var splited = [];
    
    for(var i = 0, part = 0, len = this.length; i < len; i++, part++) {

        if(part == n) {

            splited.push(
                this.slice(splited.length * n, i)
            );

            part = 0;
        }
    }

    return splited;
};
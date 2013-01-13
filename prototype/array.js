/**
 * Разбивка массива на массив массивов по n-элементов
 * @this   Array
 * @param  {Number} n Периодичность разбивки
 * @return {Array}    Массив массивов
 */
Array.prototype.split = function(n) {
    
    var splitted = [];
    
    for(var i = 0, part = 0, len = this.length; i < len; i++, part++) {

        if(part == n) {

            splitted.push(
                this.slice(splitted.length * n, i)
            );

            part = 0;
        }
    }

    return splitted;
};
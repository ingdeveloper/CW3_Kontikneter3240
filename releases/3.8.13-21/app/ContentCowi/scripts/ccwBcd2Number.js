
/*
 * bcd2number -> takes a nodejs buffer with a BCD and returns the corresponding number.
 * input: nodejs buffer
 * output: number 
 */
var bcd2number = function (bcd) {
    var n = 0;
    var m = 1;
    for (var i = 0; i < bcd.length; i += 1) {
        n += (bcd[bcd.length - 1 - i] & 0x0F) * m;
        n += ((bcd[bcd.length - 1 - i] >> 4) & 0x0F) * m * 10;
        m *= 100;
    }
    return n;
};

/*
 * number2bcd -> takes a number and returns the corresponding BCD in a nodejs buffer object.
 * input: 32 bit positive number, nodejs buffer size
 * output: nodejs buffer 
 */
var number2bcd = function (number, size) {
    var s = size || 4; //default value: 4
    var bcd = new Array(s);
    bcd.fill(0);
    while (number !== 0 && s !== 0) {
        s -= 1;
        bcd[s] = (number % 10);
        number = (number / 10) | 0;
        bcd[s] += (number % 10) << 4;
        number = (number / 10) | 0;
    }
    return bcd;
};

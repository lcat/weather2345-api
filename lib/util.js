/**
 * 去除头尾空格
 * @param  {[string]} text [description]
 * @return {[string]}      [description]
 */
exports.trim = function(text) {
    if (!String.prototype.trim) {
        return text.replace(/^\s+|\s+$/g, '');
    } else {
        return text.trim();
    }
}

//格式化字符串，format('string format {0}','ok');
exports.format = function() {

    if (arguments.length === 0) {

        return null;
    }

    var str = arguments[0];

    for (var i = 1, length = arguments.length; i < length; i++) {

        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');

        str = str.replace(re, arguments[i]);
    }

    return str;
}
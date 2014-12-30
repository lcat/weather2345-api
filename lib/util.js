/**
 * 去除头尾空格
 * @param  {[string]} text [description]
 * @return {[string]}      [description]
 */
exports.trim = function(text) {
    if (!String.prototype.trim) {
        return text.replace(/^\s+|\s+$/g, '');
    }
    else {
        return text.trim();
    }
}

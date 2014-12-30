var _        = require('lodash');
var Promise  = require('bluebird');
var request  = Promise.promisify(require("request"))

var config   = require('../lib/config');

/**
 * 搜索城市
 * @param  {[string]} query [中文, 拼音, 电话区号, 城市/景点]
 * @return {[json]}         [复合的城市列表]
 */
var searchCity = function(query) {

    if (!query) {
        return {};
    }

    var param = {
        url: _.template(config.searchCity, {city: query}),
        method: 'GET',
        json: true
    };

    return request(param).then(function(res) {
        // console.log(response.statusCode) 
        var data = res[0].body;

        return data.res;
    })

}

module.exports = searchCity;
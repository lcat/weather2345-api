var _        = require('lodash');
var Promise  = require('bluebird');
var cheerio  = require('cheerio');
var iconv    = require('iconv-lite');
var request  = require('request');
var url      = require('url');

var config   = require('../lib/config');
var util     = require('../lib/util');


var weather = function(uri) {

    if (!uri) {
        return {};
    }

    var param = {
        method: 'GET',
        encoding : null,
        url: _.template(config.weather, {uri: uri})
    };
    
    return new Promise(function (resolve, reject) {

        request.get(param, function(err, res, _body) {

            if (err) {
                reject(err);
            }
            var content =  iconv.decode(_body, 'gb2312');

            var $ = cheerio.load(content);

            var $wea_detail = $('.wea-detail');
            var $air        = $('#liveInfoAqi');
            var $week_day7  = $wea_detail.find('.week_day7');
            var $week_day8  = $wea_detail.find('.week_day8');

            var forecast7 = _weekDay8($week_day7, $);

            var _url = url.parse(param.url, true);

            if (_url.query && Number(_url.query.day) === 15) {
                var forecast15 = _weekDay8($week_day8, $);
                resolve({
                    forecast: forecast7.concat(forecast15)
                });
            }
            else {
                resolve({
                    forecast7: forecast7
                });
            }
        })

    })
};

/**
 * 一周天气预报
 * @param  {[$dom]} el  [description]
 * @param  {[$dom]} $   [description]
 * @return {[array]}    [description]
 */
function _weekDay7(el, $) {
    
    var forecast = [];

    _.each(el.find('li'), function(item) {

        var child = $(item).children();

        var obj = {

            date: util.trim($(child[0]).text()),

            day: $(child[2]).text().replace('白天：', ''),

            night: $(child[3]).text().replace('夜间：', ''),

            maxTem: $(child[4]).find('.red').text().replace('℃', ''),

            minTem: $(child[4]).find('.blue').text(),

            wind: $(child[4]).text().split('\n')[1]
        };

        forecast.push(obj);
    });

    return forecast;
}

/**
 * 获取 8-15 天气
 * @param  {[type]} el [description]
 * @param  {[type]} $  [description]
 * @return {[array]}    [description]
 */
function _weekDay8(el, $) {

    var forecast = [];

    _.each(el.find('li'), function(item) {

        var child = $(item).children();

        var obj = {

            date: util.trim($(child[0]).text()),

            day: $(child[2]).text(),

            maxTem: $(child[3]).find('.red').text().replace('℃', ''),

            minTem: $(child[3]).find('.blue').text()
        };

        forecast.push(obj);
    });

    return forecast;
}

/**
 * 获取空气质量
 * @param  {[type]} el [description]
 * @param  {[type]} $  [description]
 * @return {[type]}    [description]
 */
function _airInfo(el, $) {
    console.log(el.toString())
    return point = el.find('b.cur').text();

}

module.exports = weather;
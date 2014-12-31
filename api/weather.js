var _        = require('lodash');
var Promise  = require('bluebird');
var cheerio  = require('cheerio');
var iconv    = require('iconv-lite');
var request  = require('request');
var url      = require('url');

var config   = require('../lib/config');
var util     = require('../lib/util');

var forecast = function(uri) {

    return new Promise(function(resolve, reject) {

        var param = {
            method: 'GET',
            encoding : null,
            url: _.template(config.weather, {uri: uri})
        };

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

            var forecast7  = _weekDay7($);
            var forecast15 = _weekDay8($);

            var cityId = _getCityId($);

            resolve({
                forecast: forecast7.concat(forecast15),
                cityId: cityId
            });
        })

    })
}

/**
 * 获取预警信息
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
var getAlert = function(obj) {

    var cityId = obj.cityId;
    var timestamp = new Date().getTime();

    return new Promise(function(resolve, reject) {

        var param = {
            url: _.template(config.alert, {cityId: cityId, timestamp})
            meth: 'GET'
        };

        request.get(param, function(err, res, body) {

            resolve('');

        })

    })
};

var getShikuang = function(obj) {

    var cityId = obj.cityId;
    var timestamp = new Date().getTime();

    return new Promise(function(resolve, reject) {

        var param = {
            url: _.template(config.shikuang, {cityId: cityId, timestamp})
            meth: 'GET'
        };

        request.get(param, function(err, res, body) {

            resolve('');

        })

    })
}

var weather = function(uri) {

    if (!uri) {
        return {};
    }

    return forecast(uri)
        .then(function(data) {
            return new Promise.settle([getAlert(data), getShikuang(data)])
                .then(function(results) {
                    return ''
                })
        })
};

/**
 * 一周天气预报
 * @param  {[$dom]} el  [description]
 * @param  {[$dom]} $   [description]
 * @return {[array]}    [description]
 */
function _weekDay7($) {
    
    var el = $('.week_day7');
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
function _weekDay8($) {

    var el = $('.week_day8');
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
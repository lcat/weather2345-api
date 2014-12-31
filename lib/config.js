module.exports = {

    base: 'http://tianqi.2345.com/',

    searchCity: 'http://tianqi.2345.com/t/searchCity.php?q=<%= city %>&pType=local',

    weather: 'http://tianqi.2345.com<%= uri %>',

    alert: 'http://tianqi.2345.com/t/shikuang/alert/js/<%= cityid %>.js?<%= timestamp %>',

    shikuang: 'http://tianqi.2345.com/t/shikuang/<%= cityid %>.js?<%= timestamp %>'

}
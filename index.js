var api = require('./api');

module.exports = api;

// api.searchCity('xianyou').then(function(list) {
//     console.log(list);
// })

api.weather('/xianyou/60076.htm?day=15&air=false').then(function(data) {
    console.log(data)
})
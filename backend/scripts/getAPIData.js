const http = require("http");

let getAPIData = (function () {
    let EventEmitter = require("events").EventEmitter;
    let emitter = new EventEmitter();

    let on = function (evt, cb) {
        emitter.on(evt, cb);
    };

    let once = function (evt, cb) {
        emitter.once(evt, cb);
    };

    let optionsAPI = {
        method: "GET",
        port: "80",
        hostname: "api.flickr.com"
    };

    let clean = function (json) {
        json = json.substring(1, json.length - 1);
        json = json.replace(/\\\'/g, '');
        return json;
    };

    let callAPI = function (search, options, cb) {
        if (search !== "") {
            optionsAPI = options ? options : optionsAPI;
            optionsAPI.path = "/services/feeds/photos_public.gne?format=json&tags=" + search + "&jsoncallback=?";
        }

        http.request(optionsAPI, function (response) {
            var json = "";

            response.on("data", function (chunck) {
                json += chunck;
            });

            response.on("end", function () {
                var jsonObject = JSON.parse(clean(json));
                cb(null, jsonObject);
                emitter.emit("apiData", jsonObject.items);
            });

            response.on("error", function (err) {
                console.log(err.message);
                cb(err, null);
            });
        }).end();
    };

    return {
        on: on,
        once: once,
        callAPI: callAPI
    };
})();

module.exports = getAPIData;
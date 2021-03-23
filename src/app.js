"use strict";
exports.__esModule = true;
var express = require("express");
var crawler_1 = require("./modules/crawler");
var app = express();
var port = 3000;
app.get('/', function (req, res) {
    var crawler = new crawler_1.CheerioCrawler();
    res.send(crawler.test());
});
app.listen(port, function () {
    return console.log("server is listening on " + port);
});

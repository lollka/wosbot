var cluster = require('cluster');
if (cluster.isMaster) {
  cluster.fork();
  cluster.on('exit', function(worker, code, signal) {
    if (code != 69){
		cluster.fork();
	}
  });
}
if (cluster.isWorker) {
//SÂKUMS
var Antigate = require('antigate');
var Horseman = require('node-horseman');
var jsdom = require("node-jsdom");

var x_apicode = "";
var x_website = "";

var ag = new Antigate(x_apicode);

var bl = process.argv.slice(2).toString();
console.log(bl);
setbanner("http://wos.lv/?q=free_ad&place="+bl);

function setbanner(bannerurl) {
    var horseman = new Horseman();
    horseman
        .cookies({
            name : 'domain',
            value : x_website,
            domain: 'wos.lv'
        })
        .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
        .on('urlChanged', function(targetUrl){
            console.log(targetUrl);
        })
        .open("http://wos.lv/")
        .then(function() {
            horseman
                .open(bannerurl)
                .html('body')
                .then(function(html) {
                    jsdom.env(
                        html,
                        ["http://code.jquery.com/jquery.js"],
                        function (err, window) {
                            var ready = window.$("font").text().substring(0,17);
                            if (ready.includes("too slow")) {
                                console.log("Vieta ir aizòemta!");
                                process.exit(69);
                            } else {
                                horseman
                                    .cropBase64("img", "PNG")
                                    .then(function(cropBase64) {
                                        ag.process(cropBase64, function(error, text, id) {
                                            if (error) {
                                                throw error;
                                            } else {
                                                console.log("Ievadîtais captcha ir: "+text);
                                                horseman
                                                    .upload('input[name="b"]', 'banner.png')
                                                    .type('input[name="code"]', text)
                                                    .mouseEvent('mousemove', 100, 190)
                                                    .mouseEvent('mousemove', 120, 203)
                                                    .mouseEvent('click', 196, 244)
                                                    .wait(180)
                                                    .then(function() {
                                                        horseman.close();
														return setbanner("http://wos.lv/?q=free_ad&place="+bl);
                                                    });
                                            }});
                                    });
                            }
                        });
                });
        });
	}
}
var request = require("request");
var JSON = require('JSON');
var moment = require("moment-timezone");
var delayed = require('delayed');
var spawn = require('child_process').spawn;

const SimpleNodeLogger = require('simple-node-logger'),
	opts = {
		logFilePath:'wos.log',
		timestampFormat:'HH:mm:ss'
	},
	log = SimpleNodeLogger.createSimpleLogger( opts );

var url1 = "http://wos.lv/index.php?q=ajax";
var childs = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var freespots = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

gettimes();
function gettimes(){	
request(url1,function (error, response, wosresponse) {
        var kek = JSON.parse(wosresponse);
        for (var i = 0; i < kek.banners.length; i++) {
            var place = kek.banners[i];
            var placetime = place.ttl;			
			//log.info(i+1 + " @ " + placetime);
			checker(i+1, placetime);
        }
});		
}
	
function checker(spot, time) {
    
        now = moment().tz("Europe/Riga").format('YYYY-MM-DD HH:mm:ss');
		next = moment(time*1000).tz("Europe/Riga").format('YYYY-MM-DD HH:mm:ss');
        formattedDate = moment.utc(moment(next,"YYYY-MM-DD HH:mm:ss").diff(moment(now,"YYYY-MM-DD HH:mm:ss"))).format("HH:mm:ss")
        hh = parseInt(moment(formattedDate,"HH:mm:ss").format("HH"))*3600;
        mm = parseInt(moment(formattedDate,"HH:mm:ss").format("mm"))*60;
        ss = parseInt(moment(formattedDate,"HH:mm:ss").format("ss"));
        timeinms = (hh+mm+ss)*1000;
        if (timeinms > 18000000) {
			if (childs[spot-1] === 0){
				childs[spot-1] = 1;
				log.info("spawning for "+spot);
				var child = spawn(process.execPath, ['wos_worker.js', spot]);
				child.on('exit', function() {
					log.info("reserved for "+spot);
					childs[spot-1] = 0;
					freespots[spot-1] = 1;
					spotarray();
				});
			} else {
				log.info("In progress...");
			}						
        } else if (hh === 0 && mm === 0 && ss === 0) {
			if (childs[spot-1] === 0){
				childs[spot-1] = 1;
				log.info("spawning for "+spot);
				var child = spawn(process.execPath, ['wos_worker.js', spot]);
				child.on('exit', function() {
					log.info("reserved for "+spot);
					childs[spot-1] = 0;
					freespots[spot-1] = 1;
					spotarray();
				});
			} else {
				log.info("In progress...");
			}
        } else {
            log.info(spot+" pieejams pec "+formattedDate+", sleep uz " +timeinms+" ms");
			freespots[spot-1] = 1;
            delayed.delay(function () { checker( spot, time ) }, timeinms);
        }
    
}

function spotarray() {
	if (freespots.reduce(add, 0) === 35){
		log.info("spot array on");
		freespots = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		gettimes();
	}
}

function add(a, b) { return a + b; }
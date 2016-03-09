// 'use strict';

var noDuplicateIp = false;
var timeDifference = 60000;//1 minute
var monthConvert = {Jan:0,Feb:1,Mar:2,Apr:3,MAY:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
var fs = require('fs'), readline = require('readline');
var instream = fs.createReadStream('az.txt');
var ws = fs.createWriteStream('ips1.txt');
var jsonfile = require('jsonfile')
 
var file = 'locs.json'
var obj = [];

var rl = readline.createInterface({
    input: instream,
    output: ws,
    terminal: false
});
var cnt = 0;
var wos = [];
rl.on('line', function(line) {
	var wo = parse(line);
	if(wo){
		cnt++;
		console.log(cnt);
		//console.log(wo);
		var flag = false;
		if(noDuplicateIp){
			wos.forEach(function(item){
				var ipCur = wo.split("-")[0];
				var timeCur = wo.split("-")[1];
				var ipItem= item.split("-")[0];
				var timeItem = item.split("-")[1];
				if(ipCur==ipItem && !flag){
					var curTime = new Date(timeCur);
					var itemTime = new Date(timeItem);
					var lapse = curTime - itemTime;
					//var differenc = lapse.getTime();
					console.log(lapse);
					if(lapse < timeDifference){
						flag = true;
					}
				}
			})
			console.log(flag);
			wos.push(wo);
		}
		var ipCur = wo.split("-")[0];
		var timeCur = wo.split("-")[1];
		obj.push({ip:ipCur,time:timeCur});
		console.log(wo);
		//if(!flag)  
			ws.write(wo+'\r\n');

	}
});
rl.on('close', function() {
	jsonfile.writeFileSync(file, obj)
  console.log('Have a great day!');
  process.exit(0);
});
var parse = function(line){
	var start = line.indexOf('"');
	var end = line.lastIndexOf('"');
	var message = line.slice(start + 1, end);
	var ip, time;
	//console.log(message.indexOf("GET \/cgi-bin\/WebObjects\/"));
	if(message.indexOf("GET /cgi-bin/WebObjects/")>-1){
		ip = line.split(" ")[0];
		//date = line.substr(line.indexOf("[")+1, 11);
		time = line.substr(line.indexOf("[")+1, 21);
		var timeCurArray = time.split(":");
		var dateCurArray = timeCurArray[0].split("/");
		var curTime = new Date(dateCurArray[2], monthConvert[dateCurArray[1]], dateCurArray[0], timeCurArray[1], timeCurArray[2], timeCurArray[3], 0);
		return ip + "-" + curTime;
	}else{
		return null;
	}
//console.log(message);
};







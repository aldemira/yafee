/*
This file is part of Yet another foreign exchange extension (YAFEE).

    YAFEE is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Foobar is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Yafee.  If not, see <http://www.gnu.org/licenses/>.
*/
//Set the alarm
chrome.runtime.onInstalled.addListener(function () {
	chrome.alarms.create("getrates", {
	       delayInMinutes: 5, periodInMinutes: 5});

});

// Get the rate and set the badge text on the icon.
// if there is huge change with the rate show a notification
chrome.alarms.onAlarm.addListener(function( alarm ) {
	var mylastrate = 0;
	var sourceCur = '';
	var destCur = '';
	var secondaryCur = '';
	var mymessage = '';
	var threshold = 0.01;
	var rate = 0;
	var xhttp=new XMLHttpRequest();
	chrome.storage.local.get('curoptions', function(result) {
		sourceCur = result.curoptions.sourceCur;
		secondaryCur = result.curoptions.secondaryCur;
		destCur = result.curoptions.destCur;
		threshold = result.curoptions.threshold

		xhttp.open("GET", "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20%3D%20%22"+sourceCur+destCur+"%22&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", true);
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				var doc = xhttp.responseXML;
				rate = doc.getElementsByTagName("rate")[0].getElementsByTagName("Rate")[0].firstChild.nodeValue;
				//console.log("Got an alarm!" + rate);
				var name = doc.getElementsByTagName("rate")[0].getElementsByTagName("Name")[0].firstChild.nodeValue;
				chrome.storage.local.get('lastrate', function(rates) {
					mylastrate = rates.lastrate;
					if (mylastrate != 0 && mylastrate > rate)
						chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
					else
						chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 0, 255] });

					chrome.browserAction.setBadgeText({text: rate});
					chrome.storage.local.set({ 'lastrate': rate }, function() {});
						if(Math.abs(mylastrate - rate) >= (threshold * 0.01)) {
							var myicon = '';
							if(mylastrate < rate)
								myicon = 'down-arrow.png';
							else
								myicon = 'up-arrow.png';
							mymessage = name+" is:" + rate + "\n It was "+mylastrate+" before";

							var opt = {
							    type: 'basic', 
							    title: "Significant Change Detected", 
							    message: mymessage,
							    iconUrl: myicon
							};
							chrome.notifications.create(
							    "3l33t",
							    opt,
							function() {} 
							);
						}

				});
			});
		}
	};
	xhttp.send(null);

});

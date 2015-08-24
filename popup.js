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
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/
$(document).ready(function() {
$(function() {
    $( "#tabs" ).tabs();
});
});
var xhttp=new XMLHttpRequest();
xhttp.open("GET", "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20%3D%20%22USDTRY%22&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", true);
xhttp.onreadystatechange = function () {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		var doc = xhttp.responseXML;
		var primaryrate = doc.getElementsByTagName("rate")[0].getElementsByTagName("Rate")[0].firstChild.nodeValue;
		var name = doc.getElementsByTagName("rate")[0].getElementsByTagName("Name")[0].firstChild.nodeValue;
		$("#result").text("Latest Rate is: "+primaryrate);
		var mylastrate = 0;
		chrome.storage.sync.get({ lastrate: '0' }, function(rates) {
			mylastrate = rates.lastrate;
		});
		if (mylastrate != 0 && mylastrate > primaryrate)
			chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
		else
			chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 0, 255] });
		chrome.browserAction.setBadgeText({text: primaryrate});
		chrome.storage.sync.set({ lastrate: rate }, function() { return; });
	}
};
xhttp.send(null);

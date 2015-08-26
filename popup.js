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

//http://api.doviz.com/list/C
$(document).ready(function() {
	$( "#tabs" ).tabs();
});

chrome.storage.local.get('curoptions', startProcess);

function startProcess(results)
{
	var mypricurname = results.curoptions.sourceCur;
	var myseccurname = results.curoptions.secondaryCur;
	var mydestcurname = results.curoptions.destCur;

	$('#tabs-1-href').text(mypricurname+' Today');
	$('#tabs-2-href').text(mypricurname+' Last Week');
	$('#tabs-3-href').text(myseccurname+ ' Today');

	$('#tabs-1').prepend('<p><img src="https://chart.finance.yahoo.com/z?s='+mypricurname+mydestcurname+'%3dx&t=1d"></p>');
	$('#tabs-2').prepend('<p><img src="https://chart.finance.yahoo.com/z?s='+mypricurname+mydestcurname+'%3dx&t=7d"></p>');
	$('#tabs-3').prepend('<p><img src="https://chart.finance.yahoo.com/z?s='+myseccurname+mydestcurname+'%3dx&t=1d"></p>');
	$('#tabs-4').prepend('<p><img src="https://chart.finance.yahoo.com/z?s='+mypricurname+mydestcurname+'%3dx&t=7d&c='+myseccurname+mydestcurname+'%3dx"></p>');

	var myurl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20%3D%20%22"+mypricurname+mydestcurname+"%22&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	getXML(myurl, true);
	var myurl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20%3D%20%22"+myseccurname+mydestcurname+"%22&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	getXML(myurl, false);
}

function getXML(url, isprimary)
{
	var xhttp=new XMLHttpRequest();
	xhttp.open("GET", url, true);
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var doc = xhttp.responseXML;
			rate = doc.getElementsByTagName("rate")[0].getElementsByTagName("Rate")[0].firstChild.nodeValue;
			var name = doc.getElementsByTagName("rate")[0].getElementsByTagName("Name")[0].firstChild.nodeValue;
			console.log(rate);
			if (isprimary == true) {
				chrome.storage.local.get('lastrate', function(rates) {
					mylastrate = rates.lastrate;
					if (mylastrate != 0 && mylastrate > rate)
						chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
					else
						chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 0, 255] });
					chrome.browserAction.setBadgeText({text: rate});
					chrome.storage.local.set({ 'lastrate': rate }, function() {});
					return rate;
				});
			}
			$('#result').append('Latest '+name+' rate is:'+rate+"<br>\n");
		}
	};
	xhttp.send(null);
}

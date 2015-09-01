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

// Set the tabs
$(document).ready(function() {
	$( "#tabs" ).tabs();
});

chrome.storage.local.get('curoptions', startProcess);

// We got the click so fill in the popup.html
// and make sure we got every parameter
function startProcess(results)
{
	var mypricurname = '';
	var myseccurname = '';
	var mydestcurname = '';
	var myurl = '';
	var dsource = '';
	if(results.curoptions == undefined) {
		mypricurname = 'USD';
		myseccurname = 'EUR';
		mydestcurname = 'TRY';
		dsource = 'Yahoo!';
	} else {
		mypricurname = results.curoptions.sourceCur;
		myseccurname = results.curoptions.secondaryCur;
		mydestcurname = results.curoptions.destCur;
		dsource = results.curoptions.dsource;
	}

	$('#tabs-1-href').text(mypricurname+' Today');
	$('#tabs-2-href').text(mypricurname+' Last Week');
	$('#tabs-3-href').text(myseccurname+ ' Today');
	$('#tabs-4-href').text(mypricurname+'-'+myseccurname+' Comparison');

	if (dsource == 'Yahoo!') {
		$('#tabs-1').prepend('<p><img src="https://chart.finance.yahoo.com/z?s='+mypricurname+mydestcurname+'%3dx&t=1d"></p>');
		$('#tabs-2').prepend('<p><img src="https://chart.finance.yahoo.com/z?s='+mypricurname+mydestcurname+'%3dx&t=7d"></p>');
		$('#tabs-3').prepend('<p><img src="https://chart.finance.yahoo.com/z?s='+myseccurname+mydestcurname+'%3dx&t=1d"></p>');
		$('#tabs-4').prepend('<p><img src="https://chart.finance.yahoo.com/z?s='+mypricurname+mydestcurname+'%3dx&t=7d&c='+myseccurname+mydestcurname+'%3dx"></p>');
	} else {
		$('#tabs-1').prepend("<p><img src='http://www.bbc.co.uk/news/business/market_data/chart?chart_primary_ticker=FX^"+mypricurname+":"+mydestcurname+"&chart_time_period=1_day&canvas_colour=000000&primary_chart_colour=CC0000&use_transparency=0&plot_colour=ffffff&cp_line_colour=1F4F82&margin_left=30&margin_bottom=20&margin_right=2&time_24hr=1&tiny_chart=0&tiny_month_view=0&logo_strength=light&y_axis_left=1&x_axis_plain=1&cp_line=1&cp_line_style=dotline&charting_freq=1_minute&co_dimension^width=512&co_dimension^height=288&small_chart_x_label_format=1&date_label_spacing=40'></p>");
		$('#tabs-2').prepend("<p><img src='http://www.bbc.co.uk/news/business/market_data/chart?chart_primary_ticker=FX^"+mypricurname+":"+mydestcurname+"&chart_time_period=7_day&canvas_colour=000000&primary_chart_colour=CC0000&use_transparency=0&plot_colour=ffffff&cp_line_colour=1F4F82&margin_left=30&margin_bottom=20&margin_right=2&time_24hr=1&tiny_chart=0&tiny_month_view=0&logo_strength=light&y_axis_left=1&x_axis_plain=1&cp_line=1&cp_line_style=dotline&charting_freq=1_minute&co_dimension^width=512&co_dimension^height=288&small_chart_x_label_format=1&date_label_spacing=40'></p>");
		$('#tabs-3').prepend("<p><img src='http://www.bbc.co.uk/news/business/market_data/chart?chart_primary_ticker=FX^"+myseccurname+":"+mydestcurname+"&chart_time_period=1_day&canvas_colour=000000&primary_chart_colour=CC0000&use_transparency=0&plot_colour=ffffff&cp_line_colour=1F4F82&margin_left=30&margin_bottom=20&margin_right=2&time_24hr=1&tiny_chart=0&tiny_month_view=0&logo_strength=light&y_axis_left=1&x_axis_plain=1&cp_line=1&cp_line_style=dotline&charting_freq=1_minute&co_dimension^width=512&co_dimension^height=288&small_chart_x_label_format=1&date_label_spacing=40'></p>");
		$('#tabs-4').prepend("<p><img src='http://www.bbc.co.uk/news/business/market_data/chart?chart_primary_ticker=FX^"+mypricurname+":"+myseccurname+"&chart_time_period=7_day&canvas_colour=000000&primary_chart_colour=CC0000&use_transparency=0&plot_colour=ffffff&cp_line_colour=1F4F82&margin_left=30&margin_bottom=20&margin_right=2&time_24hr=1&tiny_chart=0&tiny_month_view=0&logo_strength=light&y_axis_left=1&x_axis_plain=1&cp_line=1&cp_line_style=dotline&charting_freq=1_minute&co_dimension^width=512&co_dimension^height=288&small_chart_x_label_format=1&date_label_spacing=40'></p>");
	}

	myurl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20%3D%20%22"+myseccurname+mydestcurname+"%22&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	getXML(myurl, false);
	//Sleep gives us a bit of a synchronisation
	sleep(100);
	myurl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20%3D%20%22"+mypricurname+mydestcurname+"%22&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	getXML(myurl, true);
}

// Get the latest rate from Yahoo! and parse the XML
// Finally set the result div with the value
function getXML(url, isprimary)
{
	var myxml = '';
	$.get(url, function( data ) {
		$rate = $(data).find("Rate");
		$name = $(data).find("Name");
		if (isprimary == true) {
			chrome.storage.local.get('lastrate', function(rates) {
				mylastrate = rates.lastrate;
				if (mylastrate != 0 && mylastrate > $rate.text())
					chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
				else
					chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 0, 255] });
				chrome.storage.local.set({ 'lastrate': $rate.text() }, function() {});
				chrome.browserAction.setBadgeText({text: $rate.text()});
			});

		}
		$('#result').append('Latest '+$name.text()+' rate is:'+$rate.text()+"<br>\n");
	}, 'xml');
}

// Self explanatory
// Found on: http://www.phpied.com/sleep-in-javascript/
function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
		}
}

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
function save_options() 
{
  var source = $('#prisource option:selected').text();
  var second = $('#secondarysource option:selected').text();
  var dest = $('#dest option:selected').text();
  var threshold = $('#threshold').val();
  var currencies = { 'sourceCur': source, 'secondaryCur': second, 'destCur': dest , 'threshold': threshold};
  if((source != second) && (source != dest) && (second != dest)) {
	  chrome.storage.local.set({
		  'curoptions': currencies
	  }, function() {
	    // Update status to let user know options were saved.
	    $('#status').attr('style','color: black');
	    $('#status').text('Options saved.');
	    setTimeout(function() {
	      $('#status').text = ('');
		}, 750);
	  });
	  setTimeout(function() { window.close;}, 1000);
  } else {
	  $('#status').text('Primary and Secondary currencies cannot be the same.');
	  $('#status').attr('style','color: red');
  }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.local.get('curoptions', function(items) {
		//$('#prisource option[value="'+items.sourceCur+'"]').val(items.sourceCur);
	if(items.curoptions.sourceCur != '')
		$('#prisource').val(items.curoptions.sourceCur);
	else
		$('#prisource').val('USD');

  	if(items.curoptions.secondaryCur != '')
		$('#secondarysource').val(items.curoptions.secondaryCur);
  	else
	  	('#secondarysource').val('EUR');

  	if(items.curoptions.dest != '')
		$('#dest').val(items.curoptions.destCur);
  	else
	  	$('#dest').val('TRY');

  	if(items.curoptions.threshold != '')
	  	$('#threshold').val(items.curoptions.threshold);
  	else
	  	$('#threshold').val('5');
  });
}

function stopTimer()
{
	timer.stop();
	window.close();
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

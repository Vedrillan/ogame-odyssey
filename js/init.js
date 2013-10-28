// Add button in left menu
$("#menuTableTools").append('<li id="odyssey"><a class="menubutton" href="#"><span class="textlabel">Odyssey</span></a></li>');

// inject javascript to get js variable of the page
function data() {
	$('body').attr('data-minifleettoken', miniFleetToken);
	$('body').attr('data-canloadcontentlink', canLoadContentLink);
	$('body').attr('data-contentlink', contentLink);
	$('body').attr('data-minifleetlink', miniFleetLink);
	$('body').attr('data-galaxy', galaxy);
	$('body').attr('data-system', system);
	$('body').attr('data-mission', constants.espionage);
	$('body').attr('data-shipamount', spionageAmount);
}

function dataMiniFleet () {
	$('body').attr('data-minifleettoken', miniFleetToken);
	$('body').attr('data-minifleetlink', miniFleetLink);
}

function injectData() {
	var script = document.createElement('script');
	script.appendChild(document.createTextNode('('+ data +')();'));
	(document.body || document.head || document.documentElement).appendChild(script);
}

function injectDataMiniFleet () {
	var script = document.createElement('script');
	script.appendChild(document.createTextNode('('+ dataMiniFleet +')();'));
	(document.body || document.head || document.documentElement).appendChild(script);
}

chrome.storage.sync.get(function(item) {
    distance = item.distance || 1;
    minrank = item.minrank || 5000;

    Configuration.init();
    // Run the explorer
	if (document.location.href.indexOf('page=galaxy') != -1) {
		Explorer.init();
	}
});
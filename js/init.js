$("#menuTableTools").append('<li id="odyssey"><a class="menubutton" href="#"><span class="textlabel">Odyssey</span></a></li>');

// Run only on galaxy view
if (document.location.href.indexOf('page=galaxy') != -1) {
	OgameOdyssey.init();
}
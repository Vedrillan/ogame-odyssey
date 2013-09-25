var OgameOdyssey = {

    currentSystem: $('#system_input').val(),
    currentGalaxy: $('#galaxy_input').val(),
    distance: 1,
    interestMinRank: 3000,

    init: function() {
        // add buttons
        $('#galaxyheadbg > td > div').append('<div id="odyssey_prev" style="position:absolute;top: 32px;left: 430px;"><a href="javascript:void(0)"><span class="text">Scan prev</span></a></div><div id="odyssey_next" style="position:absolute;top: 32px;left: 550px;"><a href="javascript:void(0)"><span class="text">Scan next</span></a></div>');
        
        // add click listener on created buttons
        $('#odyssey_prev').click(function() {
            OgameOdyssey.analyze('previous');
        });
        $('#odyssey_next').click(function() {
            OgameOdyssey.analyze('next');
        });

        // add a not visible div for content manipulation
        $('body').append('<div id="odyssey_data" style="display:none"/>');
    },

    analyze: function(direction) {
        // loop for a certain amount of system
        for(var i = 0; i < this.distance; i++) {
            // change direction
            if (direction == 'previous') {
                this.currentSystem--;
            } else if (direction == 'next') {
                this.currentSystem++;
            }

            if (this.currentSystem == 0 || this.currentSystem == 500) {
                // border of the galaxy reached
                return;
            }

            // request galaxy content
            this.getSystemData(this.currentGalaxy, this.currentSystem);
        }   
    },

    getSystemData: function(galaxy, system) {
        $.post(
            'index.php?page=galaxyCanLoad&ajax=1',
            { galaxy: galaxy, system: system },
            function(data) {
                if (data.status) {
                    $.post(
                        'index.php?page=galaxyContent&ajax=1', 
                        { galaxy: galaxy, system: system }, 
                        function(data){
                            $('#odyssey_data').html(data);
                            OgameOdyssey.findInactive();
                        }
                    );
                }
            },
            'json'
        )
    },

    findInactive: function() {
        if ($('#odyssey_data .playername.longinactive:not(.vacation)').length > 0) {
            // long inactive found, check level
            $('#odyssey_data .playername.longinactive:not(.vacation)').each(function(i, e){
                if ($(e).hasClass('strong')) return true; // security check in case something goes not as expected
                var rankElement = $(e).find('.galaxyTooltip .ListLinks .rank a');
                // if the rank is high enough, go scoot
                if (rankElement.html() < OgameOdyssey.interestMinRank) {
                    elClass = rankElement.parents('td.playername').attr('class').split(' ');
                    for(var i = 0; i < elClass.length; i++) {
                        if (elClass[i].indexOf('js_playerName') != -1) {
                            var position = elClass[i].substring('js_playerName'.length);
                            OgameOdyssey.scootPlanet(OgameOdyssey.currentGalaxy, OgameOdyssey.currentSystem, position);
                        }
                    }
                }
            });
        }
    },

    scootPlanet: function(galaxy, system, position) {
        console.log('GO SCOOT ' + galaxy + ':' + system + ':' + position);
        /*$.ajax(miniFleetLink, {
            data: {
                mission: 6,
                galaxy: galaxy,
                system: system,
                position: position,
                type: 1,
                shipCount: 1,
                token: miniFleetToken
            },
            dataType: "json",
            type: "POST",
            success: function (data) {
                if (typeof (data.newToken) != "undefined") {
                    miniFleetToken = data.newToken
                }
                if (data.success) {
                    var message = data.message + " [" + data.coordinates.galaxy + ":" + data.coordinates.system + ":" + data.coordinates.position + "]";
                    console.log(message);
                } else {
                    // the token change sometime so we need to retry
                    console.log('error... :/');
                    //OgameOdyssey.scootPlanet(galaxy, system, position);
                }
            }
        });*/
    }
}
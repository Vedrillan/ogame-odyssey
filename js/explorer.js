Explorer = {
    currentSystem: null,
    currentGalaxy: null,

    init: function() {
        // add buttons
        $('#galaxyheadbg > td > div').append('<div id="odyssey-scan"><a href="javascript:void(0)"><span class="text">Auto Scan</span></a></div>');
        
        // add click listener on created buttons
        $('#odyssey-scan').click(function() {
            Explorer.analyze();
        });
    },

    analyze: function() {
        // inject some special js to get necessary data
        injectData();
        this.currentGalaxy = parseInt($('body').attr('data-galaxy'));
        this.currentSystem = parseInt($('body').attr('data-system'));

        // loop for a certain amount of system
        for(var i = 1; i <= distance; i++) {
            if (this.currentSystem == 0 || this.currentSystem == 500) {
                // border of the galaxy reached
                return;
            }
            
            // request galaxy content
            this.getSystemData(this.currentGalaxy, this.currentSystem - i);
            this.getSystemData(this.currentGalaxy, this.currentSystem + i);
        }   
    },

    getSystemData: function(galaxy, system) {
        $.post(
            $('body').attr('data-canloadcontentlink'),
            { galaxy: galaxy, system: system },
            function(data) {
                if (data.status) {
                    $.post(
                        $('body').attr('data-contentlink'), 
                        { galaxy: galaxy, system: system }, 
                        function(data){
                            Explorer.findInactive(data, galaxy, system);
                        }
                    );
                }
            },
            'json'
        );
    },

    findInactive: function(data, galaxy, system) {
        if ($(data).find('.playername.longinactive:not(.vacation)').length > 0) {
            // long inactive found, check level
            $(data).find('.playername.longinactive:not(.vacation)').each(function(i, e){
                if ($(e).hasClass('strong')) return true; // security check in case something goes not as expected
                var rankElement = $(e).find('.galaxyTooltip .ListLinks .rank a');
                // if the rank is high enough, go scoot
                if (rankElement.html() < minrank) {
                    elClass = rankElement.parents('td.playername').attr('class').split(' ');
                    for(var i = 0; i < elClass.length; i++) {
                        if (elClass[i].indexOf('js_playerName') != -1) {
                            var position = elClass[i].substring('js_playerName'.length);
                            Explorer.scootPlanet(galaxy, system, position);
                        }
                    }
                }
            });
        }
    },       

    scootPlanet: function(galaxy, system, position, retry) {
        $.ajax($('body').attr('data-minifleetlink'), {
            data: {
                mission: $('body').attr('data-mission'),
                galaxy: galaxy,
                system: system,
                position: position,
                type: 1,
                shipCount: $('body').attr('data-shipamount'),
                token: $('body').attr('data-minifleettoken')
            },
            dataType: "json",
            type: "POST",
            success: function (data) {
                if (typeof (data.newToken) != "undefined") {
                    $('body').attr('data-minifleettoken', data.newToken);
                }
                // the token changes sometime so retry once just in case
                if (!data.response.success && !retry) {
                    console.log('retry for ' + galaxy + ':' + system + ':' + position);
                    Explorer.scootPlanet(galaxy, system, position, true);
                } else {
                    Explorer.displayMessage(data.response);
                }
            },
            async: false
        });
    },

    displayMessage: function (response) {
        if(typeof(response) == 'undefined') {
            this.addToTable('Error...', "error");
            return;
        }
        var message = response.message;
        if (typeof (response.coordinates) != "undefined") {
            message += " [" + response.coordinates.galaxy + ":" + response.coordinates.system + ":" + response.coordinates.position + "]";
        }
        if (response.success) {
            this.addToTable(message, "success");
            $("#slotUsed").html(this.tsdpkt(response.slots));
            $("#probeValue").html(this.tsdpkt(response.probes));
        } else {
            this.addToTable(message, "error");
        }
    },

    addToTable: function(g, d) {
        var e = $('<div class="' + d + '">' + g + '</div>');
        e.prependTo('#fleetstatusrow');
    },

    tsdpkt: function (c) {
        var a = "";
        if (c < 0) {
            a = "-"
        }
        c = Math.abs(c);
        var b = c % 1000;
        while (c >= 1000) {
            var d = "";
            if ((c % 1000) < 100) {
                d = "0"
            }
            if ((c % 1000) < 10) {
                d = "00"
            }
            if ((c % 1000) == 0) {
                d = "00"
            }
            c = Math.abs((c - (c % 1000)) / 1000);
            b = c % 1000 + LocalizationStrings.thousandSeperator + d + b
        }
        b = a + b;
        return b
    }
};
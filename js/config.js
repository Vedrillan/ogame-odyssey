var Configuration = {
    init: function() {
        $('#odyssey').click(function(){
            $('#odyssey-config').toggle();
            $('#netz').toggle();
            $('#inhalt').toggle();
            return false;
        });

        Configuration.addContent();   
    },

    addContent: function() {
        // Prepare configuration div
        $('#contentWrapper').prepend('<div id="odyssey-config" style="display:none;"><div class="head">Odyssey Configuration</div><div class="content"></div><div class="footer"></div></div>');
        $('#odyssey-config .content').append('<div class="wrap"><div class="group"></div></div>');
        $('#odyssey-config .content .wrap .group').append('<div class="fieldwrapper"><label>Distance</label><div class="thefield"><input type="text" id="odyssey-distance" name="distance" value="' + distance + '" /></div></div>');
        $('#odyssey-config .content .wrap .group').append('<div class="fieldwrapper"><label>Rang minimum</label><div class="thefield"><input type="text" id="odyssey-minrank" name="minrank" value="' + minrank + '" /></div></div>');
        $('#odyssey-config .content').append('<div class="textCenter"><button class="btn_blue">Sauvegarder</div>');

        $('#odyssey-config .content button').click(function() {
            var distance = parseInt($('#odyssey-distance').val());
            var minrank = parseInt($('#odyssey-minrank').val());
            if(!isNaN(distance) && !isNaN(minrank)) {
                chrome.storage.sync.set({'distance': distance, 'minrank': minrank}, function() {
                    $('#odyssey-config .content button').addClass('saved');
                });
            }
            return false
        });
    }
};
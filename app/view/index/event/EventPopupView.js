define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'index/event/popup',
		
		serialize: function() {
			return {
				event: this.model.serialize()
			};
		},
		
		afterRender: function() {
			
			$.fancybox({
				content: this.$el,
                padding: 0,
                modal: false,
                hideOnOverlayClick: true,
                enableEscapeButton: true,
                showCloseButton: true,
                overlayColor: '#000',
                overlayOpacity: 0.75,

                onStart: function() {
                    $("#fancybox-outer").removeClass().addClass('event-lightbox');
                    $('#fancybox-close').text('Close');
                },

                onComplete: _.bind(function() {
                	initSlider(
                    	'#fancybox-content .popup-gallery-fader .next',
                        '#fancybox-content .popup-gallery-fader .prev',
                        '#fancybox-content .popup-gallery-fader', 
                        1103, 
                        false);

                	this.loadImages('.event-popup .popup-gallery-fader img:first-child');
                	
                	var hoverCallback = function() {
                	    var $this = $(this);
                	    $this.toggleClass('hovered', 200, 'swing');
                	};

            	    $('input[type="submit"], a').hoverIntent({
            	        over: hoverCallback,
            	        out: hoverCallback,
            	        interval: 25
            	    });

                    if (window.PIE) {
                        $('.popup-gallery-fader, .event-popup, .event-lightbox, .button-ticket').each(function() {
                            PIE.attach(this);
                        });
                    }
                }, this)
            });
		}
	});
});
define([
   'app'
],function(
	app) {

	return Backbone.View.extend({

		template: 'search/preferences',

		events: {
        	'click .js-toggle-sibling-popup' : 'toggleSiblingPopup'

        },

		initialize: function() {
			app.search.pref.on('change', this.render, this);
			app.search.terminals.on('reset', this.render, this);
		},
		
		cleanup: function() {
			app.search.pref.off('change', this.render, this);
			app.search.terminals.off('reset', this.render, this);
		},
		
		serialize: function() {
			return {
				pref: app.search.pref.toJSON(),
				arrival: {
					time: moment.utc(parseInt(app.search.pref.get('arrival').time)).format('HH:mm'),
					terminal: app.search.terminals.size() > 0 
						? app.search.terminals.get(app.search.pref.get('arrival').terminal).get('title')
						: undefined
				}
			};
		},

		afterRender: function() {



		},

		toggleSiblingPopup: function(e){
			var $this = $(e.currentTarget).next();


			if ($this.hasClass('visible')){
				$this.fadeOut().removeClass('visible');
			}else{
				$('.white-popup.visible').fadeOut().removeClass('visible');
				$this.fadeIn().addClass('visible');
			}
        }

		
	});

});
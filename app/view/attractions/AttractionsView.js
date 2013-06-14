define([
   'app',
   'view/attractions/AttractionsListView'
],function(
	app,
	AttractionsListView) {


	return Backbone.View.extend({

		template: 'attractions/attractions',
		
		initialize: function() {
			app.attractions.category.on('change', this.title, this);
		},
		
		cleanup: function() {
			app.attractions.category.off('change', this.title, this);
		},
		
		beforeRender: function() {
			this.title();
		},
		
		title: function() {
			if (app.attractions.category.has('title')) {
				app.trigger('change:title', '{0} - xperious'.format(app.attractions.category.get('title').capitalize()));
			}
		},
		
		afterRender: function() {
			this.findImages('.section').imagesLoaded(_.bind(function() {
				this.setView('.list-view', new AttractionsListView()).render();
			}, this));
		}
	});


});
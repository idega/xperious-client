define([
   'app'
],function(
	app) {

	return Backbone.View.extend({

		template: 'attractions/category',
		
		initialize: function() {
			app.attractions.category.on('change', this.render, this);
		},
	
		cleanup: function() {
			app.attractions.category.off('change', this.render, this);
		},

		serialize: function() {
			var category = app.attractions.category;
			return {
				category: category.isNew() ? undefined : category.toJSON() 
			};
		}
		
	});

});
define([
   'app'
],function(
	app) {

	return Backbone.View.extend({
		template: 'sights/correctDetails',

		afterRender: function() {
			$('.custom-select').selectmenu();
		}
	});

});
define([
   'app'
],function(
	app) {

	return Backbone.View.extend({
		template: 'user/account',

		afterRender: function() {
			$('.custom-select').selectmenu();
		}
	});

});


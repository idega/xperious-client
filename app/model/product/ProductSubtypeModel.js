define([
	'app'
], function(app) {

	return Backbone.RelationalModel.extend({

		idAttribute: 'id',

		url: function() {
			return app.apihost + '/api/v1/products/subtypes/' + this.get('id');
		}
	});

});
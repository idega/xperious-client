define([
	'app'
], function(app) {

	return Backbone.RelationalModel.extend({

		idAttribute: 'id',

		url: function() {
			return app.apihost + '/v1/categories/' + this.get('id');
		}
	});

});
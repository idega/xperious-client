define([
	'app', 
	'model/region/RegionModel'],
function(
	app, 
	RegionModel) {


	return Backbone.Collection.extend({

		model: RegionModel,
				
		url: function() {
			return app.apihost + '/v1/regions/list';
		}

	});

});
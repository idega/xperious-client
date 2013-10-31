define([
	'app', 
	'model/product/ProductSearchResultModel'],
function(
	app, 
	ProductSearchResultModel) {


	return Backbone.Collection.extend({

		model: ProductSearchResultModel,
		
		
		url: function() {
			return app.apihost + '/v1/products/search';
		},
		

		fetch: function(day) { 
			var plan = app.search.results.at(app.search.pref.get('index'));

			var items = plan.days()[day];
			var lat, lng;
			for (var i = 0; i < items.length; i++) {
				if (items[i].get('location') && items[i].get('location').latitude && items[i].get('location').longitude) {
					lat = items[i].get('location').latitude;
					lng = items[i].get('location').longitude;
					break;
				}
			}

			return this._super({data: {
				lat: lat,
				lng: lng,
				radius: 50
			}});
		}
	});

});
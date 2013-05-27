define([
	'app', 
	'model/product/ProductSearchResultModel'],
function(
	app, 
	ProductSearchResultModel) {


	return Backbone.Collection.extend({

		model: ProductSearchResultModel,
		
		
		url: function() {
			return app.apihost + '/api/v1/products/search';
		},
		

		fetch: function(day) { 
			var plan = app.search.results.at(app.search.pref.get('index'));

			var items = plan.days()[day];
			var lat, lng;
			for (var i = 0; i < items.length; i++) {
				if (items[i].get('address') && items[i].get('address').latitude && items[i].get('address').longitude) {
					lat = items[i].get('address').latitude;
					lng = items[i].get('address').longitude;
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
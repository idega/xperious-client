define([
	'app', 
	'model/product/ProductModel'],
function(
	app, 
	ProductModel) {


	return Backbone.Collection.extend({
		
		model: ProductModel,
		
		url: function() {
			return app.apihost + '/api/v1/products/list';
		},

		data: function(data) {
			this.country = data.country ? data.country : this.country;
			this.region = data.region ? data.region : this.region;
			this.category = data.category ? data.category : this.category;
			this.trigger('change');
			return this.fetch();
		},

		fetch: function() {
			return this._super({data: {
				country: this.country,
				region: this.region,
				type: 'ATTRACTION',
				category: this.category
			}});
		},

		serialize: function() {
			var json = [];
			this.each(function(item) {
				json.push(item.serialize());
			});
			return json;
		}
	});

});
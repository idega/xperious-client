define([
	'app', 
	'model/category/CategoryModel'],
function(
	app, 
	CategoryModel) {


	return Backbone.Collection.extend({

		url: function() {
			return app.apihost + '/api/v1/categories/list';
		},

		model: CategoryModel,

		fetch: function() {
			return this._super({data: {
				country: app.country(),
				type: 'ATTRACTION'
			}});
		}
	});

});
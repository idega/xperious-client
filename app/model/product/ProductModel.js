define([
	'app'],
function(
	app) {

	return Backbone.RelationalModel.extend({

		idAttribute: 'id',
		
		url: function() {
			return app.apihost + '/v1/products/' + this.get('id');
		},

		serialize: function() {
			var json = this.toJSON();
			json.summary = {};
			if (json.shortDescription) {
				json.summary.summary = json.shortDescription.stripHtml();
			} else if (json.description) {
				json.summary.summary = json.description.text.stripHtml().shorten(113);
			}
			return json;
		}

	});

});
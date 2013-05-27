define([
   'app',
   'model/event/EventModel'
],function(
	app,
	EventModel) {


	return Backbone.Collection.extend({

		model: EventModel,
		
		url: function() {
			return app.apihost + '/api/v1/events/timeline';
		},

		initialize: function() {
			app.on('change:country', this.fetch, this);
		},

		fetch: function(country) {
			this._super({data: {
				country: country ? country : app.country()
			}});
		}

	});

});
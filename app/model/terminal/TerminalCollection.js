define([
   'app',
   'model/terminal/TerminalModel'
],function(
	app,
	TerminalModel) {


	return Backbone.Collection.extend({

		model: TerminalModel,

		url: function() {
			return app.apihost + '/v1/terminals';
		},

		fetch: function(country) {
			this.reset([], {silent: true});
			this._super({data: {
				country: (country) ? country : app.country()
			}});
		}
	});

});
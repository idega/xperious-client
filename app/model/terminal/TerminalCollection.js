define([
   'app',
   'model/terminal/TerminalModel'
],function(
	app,
	TerminalModel) {


	return Backbone.Collection.extend({

		model: TerminalModel,

		url: function() {
			return app.apihost + '/api/v1/terminals/list';
		},

		fetch: function(country) {
			this.reset([], {silent: true});
			this._super({data: {
				country: (country) ? country : app.country()
			}});
		}
	});

});
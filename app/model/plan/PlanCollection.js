define([
	'app', 
	'model/plan/PlanModel'],
function(
	app, 
	PlanModel) {

	return Backbone.Collection.extend({

		model: PlanModel,

		
		url: function() {
			return app.apihost + '/api/v1/plans/search';
		},
		
		refetch: function() {
			this.reset([], {silent: true});
			this.fetch();
		},
		
		parse: function(response) {
			// resolve unique plan preview image
			var usedImages = [];
			_.each(response, function(plan) {

				var items = _.sortBy(
						plan.items, 
						function(item) { 
							return item.score; 
						})
					.reverse();

				for (var i = 0; i < items.length; i++) {
					if (items[i].type === 'PRODUCT' 
							&& items[i].images 
							&& !_.contains(usedImages, items[i].sourceId)) {
						plan.previewImage = items[i].images[0];
						usedImages.push(items[i].sourceId);
						break;
					}
				}
				
				// no unique image found, use the most relevant then
				if (!plan.previewImage) {
					for (var i = 0; i < items.length; i++) {
						if (items[i].type === 'PRODUCT' && items[i].images) {
							plan.previewImage = items[i].images[0];
							break;
						}
					}
				}

			});
			return response;
		},

		fetch: function(options) {
			var arrival = app.search.pref.get('arrival');
			options = _.extend(options || {}, {
				data: {
					query: app.search.pref.get('query'),
					country: app.search.pref.get('country'),
					terminal: arrival.terminal,
					from: app.search.pref.get('from').format('YYYY-MM-DD') + moment.utc(parseInt(arrival.time)).format('THH:mm:00'),
					to: app.search.pref.get('to').format('YYYY-MM-DDT23:59:59'),
					guests: 
						parseInt(app.search.pref.get('guests').adults)
						+ parseInt(app.search.pref.get('guests').children)
						+ parseInt(app.search.pref.get('guests').infants)
						+ parseInt(app.search.pref.get('guests').seniors)
				}
			});
			this._super(options);
			return this;
		}
	});

});
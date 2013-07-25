define([
	'app', 
	'model/plan/PlanItemModel',
	'model/plan/PlanItemCollection'],
function(
	app, 
	PlanItemModel,
	PlanItemCollection) {


	return Backbone.RelationalModel.extend({

		idAttribute: 'id',

		relations: [{
			type: Backbone.HasMany,
			key: 'items',
			relatedModel: PlanItemModel,
			collectionType: PlanItemCollection,
			includeInJSON: true,
			parse: true
		}],

		
		/* Group plan items by day. This returns days array
		 * where each element is an array itself with the items
		 * for the day.
		 */
		days: function() {
			if (!this.daysCached) {
				var days = {};
				this.get('items').each(function(item) {
					var on = moment(item.get('on')).format('YYYYMMDD');
					if (!days[on]) {
						days[on] = [];
					}
					days[on].push(item);
				});
				this.daysCached = _.values(days);
			}
			return this.daysCached;
		},

		serialize: function() {
			var json = this.toJSON();

			var currency = app.currencies.get(json.price.currency);
            json.price = _.extend({}, json.price);
            json.pricePerPerson = _.extend({}, json.pricePerPerson);
			json.price.price = currency.format(json.price.price);
			json.pricePerPerson.price = currency.format(json.pricePerPerson.price);

			json.items = [];
			this.get('items').each(function(item) {
				json.items.push(item.serialize());
			});

			return json;
		}
	});

});
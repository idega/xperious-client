define([
   'app'
], function(app) {

	return Backbone.RelationalModel.extend({


		serialize: function() {
			var json = this.toJSON();

			var currency = app.currencies.get(json.price.currency);
            json.price = _.extend({}, json.price);
            json.unitPrice = _.extend({}, json.unitPrice);
			json.price.price = currency.format(json.price.price);
			json.unitPrice.price = currency.format(json.unitPrice.price);

			// display only nicely rounded minutes to the user
			// minutes are rounded to 15 minutes intervals
			var minute = moment(json.on).format('m');
			var delta = minute > 0 ? 15 - minute % 15 : 0;
			var rounded = moment(json.on).add(delta, 'minutes');
			json.summary = {};
			json.summary.on = rounded.format('HH:mm');
			json.summary.duration = moment.duration(json.duration).humanize();
			json.summary.summary = this.summary();
			json.summary.description = this.summaryDescription();
			json.summary.image = this.summaryImage();
			
			return json;
		},


		summary: function() {
			if (this.has('shortDescription')) {
				return this.get('shortDescription').stripHtml();

			} else if (this.has('description')) {
                console.log(this.get('description'));
				return this.get('description').text.stripHtml().shorten(113);
			}
		},


		summaryImage: function() {
			if (this.has('images')) {
				return this.get('images')[0];

			} else if (this.has('logo')) {
				return this.get('logo');
			}
		},
		
		summaryDescription: function() {
			if (this.has('description')) {
				return this.get('description').text.stripHtml();
			}
		}
	});

});
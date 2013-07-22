define([
   'app'
],function(app) {

	return Backbone.Model.extend({
		idAttribute: 'id',

		serialize: function() {
			var json = this.toJSON();
			json.weekday = moment(json.starting).format('dddd');
			json.day= moment(json.starting).format('DD');
			json.month = moment(json.starting).format('MMM');
			json.year= moment(json.starting).format('YYYY');
			json.starthour = moment(json.starting).format('HH:mm');
			json.endhour = moment(json.ending).format('HH:mm');
			if (this.has('shortDescription')) {
				json.summary = json.shortDescription.stripHtml();
			} else {
				json.summary = json.description.stripHtml().shorten(113);
			}
			return json;
		}
	});

});
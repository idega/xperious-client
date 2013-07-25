define([
   'app'
],function(app) {

	return Backbone.Model.extend({
		idAttribute: 'code',

        defaults: {
            formatSymbols: {
                delimiter: {
                    thousands: ',',
                    decimal: '.'
                },
                decimalPoint: 2
            }
        },

        format: function(n) {
            return accounting.formatNumber(n, 
                this.get('formatSymbols').decimalPoint, 
                this.get('formatSymbols').delimiter.thousands, 
                this.get('formatSymbols').delimiter.decimal);
        }
	});

});
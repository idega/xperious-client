define([
   'app'
],function(app) {

	return Backbone.Model.extend({

		idAttribute: 'code',

        defaults: {
            formatMoneySymbols: {
                delimiter: {
                    thousands: ',',
                    decimal: '.'
                },
                decimalPoint: 2
            }
        },

        formatMoney: function(n) {
            return accounting.formatNumber(n, 
                this.get('formatMoneySymbols').decimalPoint, 
                this.get('formatMoneySymbols').delimiter.thousands, 
                this.get('formatMoneySymbols').delimiter.decimal);
        }
	});

});
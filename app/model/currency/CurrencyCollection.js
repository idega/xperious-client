define([
   'app',
   'model/currency/CurrencyModel'
],function(
	app,
	CurrencyModel) {

	return Backbone.Collection.extend({

		model: CurrencyModel,

		initialize: function(models, options) {
			this.add([

				new CurrencyModel({
		        	code: 'EUR'
				}),

				new CurrencyModel({
		        	code: 'LTL'
				}),

				new CurrencyModel({
                    code: 'ISK',
		            formatSymbols: {
		                delimiter: {
		                    thousands: '.',
		                    decimal: ','
		                },
		                decimalPoint: 0
		            }
				})

			]);
		}

	});
});
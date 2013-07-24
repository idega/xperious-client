define([
   'app',
   'model/country/CountryModel'
],function(
	app,
	CountryModel) {

	return Backbone.Collection.extend({

		model: CountryModel,

		initialize: function(models, options) {
			this.add([

				new CountryModel({
		        	code: 'uk',
		        	title: 'United Kingdom',
		        	icon: '/images/map-uk.png',
		        	email: 'uk@xperious.travel',
		        	zoom: 6,
		        	pin: {
		        		lat: 51.5171,
		        		lng: -0.1062
		        	},
		        	center: {
		        		lat: 51.5171,
		        		lng: -0.1062
		        	},
		        	background: [
		        		'/images/home-bg-is1.jpg',
		        		'/images/home-bg-is2.jpg',
		        		'/images/home-bg-is3.jpg',
		        		'/images/home-bg-is4.jpg',
		        		'/images/home-bg-is5.jpg'
		        	]
				}),

				new CountryModel({
		        	code: 'is',
		        	title: 'Iceland',
		        	icon: '/images/map-is.png',
		        	email: 'iceland@xperious.travel',
		        	zoom: 6,
		        	pin: {
		        		lat: 64.787583,
		        		lng: -18.413086
		        	},
		        	center: {
		        		lat: 64.787583,
		        		lng: -18.413086
		        	},
		        	background: [
		        		'/images/home-bg-is1.jpg',
		        		'/images/home-bg-is2.jpg',
		        		'/images/home-bg-is3.jpg',
		        		'/images/home-bg-is4.jpg',
		        		'/images/home-bg-is5.jpg'
		        	],
		            formatMoneySymbols: {
		                delimiter: {
		                    thousands: '.',
		                    decimal: ','
		                },
		                decimalPoint: 0
		            }
				}),

				new CountryModel({
		        	code: 'lt',
		        	title: 'Lithuania',
		        	icon: '/images/map-lt.png',
		        	email: 'lithuania@xperious.travel',
		        	zoom: 7,
		        	pin: {
		        		lat: 54.6833,
		        		lng: 26.2833
		        	},
		        	center: {
		        		lat: 55.2000,
		        		lng: 24.0000
		        	},
		        	background: [
		        		'/images/home-bg-lt1.jpg',
		        		'/images/home-bg-lt2.jpg',
		        		'/images/home-bg-lt3.jpg',
		        		'/images/home-bg-lt4.jpg',
		        		'/images/home-bg-lt5.jpg'
		        	]
				})

			]);
		}

	});

});
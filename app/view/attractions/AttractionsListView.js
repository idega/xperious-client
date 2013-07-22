define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'attractions/list',

		events: {
			'click .attractions-list a' : 'attraction'
		},

		/* Initial attractions list size */
		length: 12,

		/* Increment for attractions list whenever bottom is reached */
		increment: 8,
	
		initialize: function() {
			_.bindAll(this);
			app.attractions.products.on('reset', this.render, this);
		},

		cleanup: function() {
			app.attractions.products.off('reset', this.render, this);
			$(window).unbind('scroll', this.loadMore);
		},
		
		attraction: function(e) {
			if (!e.metaKey) {
				app.router.go(
					'attractions',
					app.attractions.country.get('code'),
					app.attractions.category.get('id'),
					app.attractions.region.get('id'),
					$(e.currentTarget).data('id'),
					{trigger: true});
				e.preventDefault();
			}
		},

		serialize: function() {
			return {
				attractions: _.first(app.attractions.products.serialize(), this.length),
				loader: this.loader(),
				baseUrl: app.router.href(
					'attractions',
					app.attractions.country.get('code'),
					app.attractions.category.get('id'),
					app.attractions.region.get('id'))
			};
		},

		afterRender: function() {
        	this.loadImages('.attractions-list .element .img');
			$(window).scroll(this.loadMore);
		},

		loadMore: function() {
			var w = $(window), d = $(document);
			if (w.scrollTop() >= d.height() - w.height() - 800) {
				if (this.length < app.attractions.products.size()) {
					this.length += this.increment;
					this.render();
				}
  			}
		}
   });


});
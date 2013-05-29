define([
	'app',
	'model/search/SearchTimeframeModel',
	'view/index/timeframe/TimeframeCalendarView',
	'view/index/timeframe/TimeframeTerminalView'
], function(
	app, 
	SearchTimeframeModel,
	TimeframeCalendarView,
	TimeframeTerminalView) {
	

	/**
	 * Customized terminal view that focuses guests field after closed.
	 */
	var TerminalView = TimeframeTerminalView.extend({
		close: function() {
			this.empty();
			$('#guests').focus();
		}
	});


	/* 
	 * Customized calendar views that have chained close() callbacks
	 * to raise terminal view on the end.
	 */
	var CalendarToView = TimeframeCalendarView.to.extend({
		close: function() {
			this.empty();
			new TerminalView({model: this.model}).render();
		}
	}); 
	

	var CalendarFromView = TimeframeCalendarView.from.extend({
		close: function() {
			this.empty();
			new CalendarToView({model: this.model}).render();
		}
	});


	return Backbone.View.extend({

		template: 'index/timeframe/timeframe',

		events: {
			'click .ico-calendar .placeholder' : 'suppress',
			'click .day-month.from' : 'suppress',
			'click .day-month.to' : 'suppress',
			'focus .ico-calendar .placeholder' : 'init',
			'focus .day-month.from' : 'from',
			'focus .day-month.to' : 'to',
		},

		initialize: function() {
			_.bindAll(this);

			this.model = app.search.timeframe;
			app.on('change:timeframe', this.change, this);
		},
		
		cleanup: function() {
			app.off('change:timeframe', this.change, this);
		},
		
		change: function() {
			this.render();
		},

		serialize: function() {
			return {
				from : {
					day: this.model.has('from') 
						? this.model.get('from').format('DD') 
						: undefined,

					month: this.model.has('from') 
						? this.model.get('from').format('MMM') 
						: undefined
				},
				to : {
					day: this.model.has('to') 
						? this.model.get('to').format('DD') 
						: undefined,

					month: this.model.has('to') 
						? this.model.get('to').format('MMM') 
						: undefined 
				}
			};
		},


		init: _.debounce(function(e) {
			// stop event propagation because calendar
			// closes on any click outside the dialog
			// e.stopPropagation();
			if (e.originalEvent !== undefined) {
				new CalendarFromView({model: this.model}).render().then(_.bind(function() {
					this.$('.ico-calendar .placeholder').focus();
				}, this));
			}
		}, 200, true),
	
		to: _.debounce(function(e) {
			// stop event propagation because calendar
			// closes on any click outside the dialog
			// e.stopPropagation();
			if (e.originalEvent  !== undefined) {
				new TimeframeCalendarView.to({model: this.model}).render().then(_.bind(function() {
					this.$('.day-month.to').focus();
				}, this));
			}
		}, 200, true),

		from: _.debounce(function(e) {
			// stop event propagation because calendar
			// closes on any click outside the dialog
			// e.stopPropagation();
			if (e.originalEvent  !== undefined) {
				this._from = new TimeframeCalendarView.from({model: this.model}).render().then(_.bind(function() {
					this.$('.day-month.from').focus();
				}, this));
			}
		}, 200, true),

		suppress: function(e) {
			// This is click event suppression callback. Need to avoid
			// click event because dialog closes on any click outside it.
			e.stopPropagation();
		},

	});

});
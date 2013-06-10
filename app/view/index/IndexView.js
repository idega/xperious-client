
define([
   'app',
   'view/index/destination/DestinationPopupView'
],function(
	app,
	DestinationPopupView) {


	return Backbone.View.extend({

		template: 'index/index',


		events: {
			'click #destination' : 'destination',
			'click #plan' : 'plan',
			'keypress #budget' : 'numeric',
		},
		

		initialize: function() {
			app.on('change:country', this.render, this);
		},
		

		cleanup: function() {
			app.off('change:country', this.render, this);
		},


		plan: function(e) {
			var country = app.country();


			/* Try to parse query string and look for period
			 * in the string. Also, this normalizes query, 
			 * i.e. removes short keywords that do not have
			 * any effect. */
			var parse = this.parse(this.$('#query').val());
			var query = parse.query;
			var from = parse.from;
			var to = parse.to;


			/* Check whether timeframe was provided by the 
			 * user. Override from/to values if one was provided.*/
			if (app.search.timeframe.has('from') 
					&& app.search.timeframe.has('to')) {
				from = app.search.timeframe.get('from');
				to = app.search.timeframe.get('to');
			}

			
			/* By default use 2 guests as specified in the
			 * field placeholder. */
			var adults = app.search.guests.get('adults');
			var children = app.search.guests.get('children');
			var infants = app.search.guests.get('infants');
			var seniors = app.search.guests.get('seniors');
			

			

			/* Use no budget filter if not provided by the user */
			var budgetfrom = '0';
			var budgetto = this.$('#budget').val();
			if (!budgetto) {
				budgetfrom = undefined;
				budgetto = undefined;
			}

			
			/* Default terminal if not provided by the user */
			var arrivalterminal = app.search.terminals.at(0).get('code');
			var arrivaltime = moment.duration(10, 'hours').asMilliseconds().toString();
			if (app.search.timeframe.has('arrival')) {
				arrivalterminal = app.search.timeframe.get('arrival').terminal;
				arrivaltime = app.search.timeframe.get('arrival').time.toString();
			}


			app.search.pref.set({
				query: query,
				country: country,
				from: from,
				to: to,
				guests: {
					adults: adults,
					children: children,
					infants: infants,
					seniors: seniors
				},
				budget: {
					from: budgetfrom,
					to: budgetto
				},
				arrival: {
					time: arrivaltime,
					terminal: arrivalterminal
				}
			});
			app.search.pref.unset('index', {silent:true});
			app.router.gosearch({trigger: true});

			e.preventDefault();
		},


		parse: function(query) {
//			var numberRegexp = new RegExp('[1-9]+(?= *(month|week|day))', 'gi');
//			var periodRegexp = new RegExp('(months|weeks|days|month|week|day)', 'gi');
//
//			var number = query.match(numberRegexp);
//			var period = query.match(periodRegexp);
//
//			if (number || period) {
//				// number not given, assume it's 1
//				if (!number) number = [1]; 
//
//				return {
//					from: moment()
//						.startOf('day')
//						.add('days', 1),
//
//					to: moment()
//						.startOf('day')
//						.add(this.toUnits(period[0]), number[0]),
//
//					query: this.reduce(query
//						.replace(numberRegexp, '')
//						.replace(periodRegexp, ''))
//				};
//
//			} else {
//				// default period is always one
//				// week  starting from tomorrow
//				return {
//					from: moment()
//						.startOf('day')
//						.add('days', 1),
//
//					to: moment()
//						.startOf('day')
//						.add('days', 7),
//
//					query: this.reduce(query
//						.replace(numberRegexp, '')
//						.replace(periodRegexp, ''))
//				};
//			}

			
			return {

				from: moment()
					.startOf('day')
					.add('days', 1),
	
				to: moment()
					.startOf('day')
					.add('days', 7),
	
				query: query
			};
		},


		reduce: function(keyword) {
			if (keyword) {
				var filtered = _.filter(
					keyword.split(' '), 
					function(word) {
						// filter out shorter than 3
						return word.length > 3;
					});

				var reduced = '';
				if (filtered.length > 0) {
					reduced = _.reduce(
						filtered,
						function(sum, word) {
							return (sum + ' ' + word).trim();
						});
				}
				return reduced;
			} else {
				return '';
			}
		},


		toUnits: function(period) {
			if (period.toLowerCase().indexOf('d') == 0) {
				return 'days';
			} else if (period.toLowerCase().indexOf('m') == 0) {
				return 'months';
			} else if (period.toLowerCase().indexOf('w') == 0) {
				return 'weeks';
			}
		},


		destination: function() {
            new DestinationPopupView().render();
		},

		serialize: function() {
			return {
				pref: app.search.pref.toJSON(),
				country: app.countries.get(app.country()).toJSON()
			};
		},

		beforeRender: function() {
			$(window).scrollTop(0);
			app.trigger('change:title', 'Welcome - xperious');
		},

		afterRender: function() {
			this.$('#query').val(app.search.pref.get('query'));

	        var $window = $(window);
            var $bottom = $('#bottom');

	        /*Placeholder for old browsers*/
	        $('input[placeholder], textarea[placeholder]').placeholder();
	

            function extractLast(term) {
        		return term.split(' ').pop();
            }
            
	        $('input.autocomplete-search-input')
	        .bind('keydown', function(event) {
		        if (event.keyCode === $.ui.keyCode.TAB 
	        		&& $(this).data('ui-autocomplete').menu.active) {
		          event.preventDefault();
		        }
		    })
		    .autocomplete({
	        	delay: 0, 

	        	source: function(request, response) {
	                  $.getJSON(app.apihost + '/api/v1/keywords/suggest?country=' + app.country(), {
	                    term: extractLast(request.term)
	                  }, response );
	            },
	            
	            search: function() {
	                  var term = extractLast(this.value);
	                  if (term.length < 1) {
	                    return false;
	                  }
	                },

                focus: function() {
                  return false;
                },

                select: function(event, ui) {
                  var terms = this.value.split(' ');
                  terms.pop();
                  terms.push(ui.item.value);
                  this.value = terms.join(' ');
                  return false;
                },

	        	response: function(event, ui) {
	        		ui.content.splice(8, ui.content.length);
	        	}
	        });
	
	        $(".slider-container").imagesLoaded(centerSliderImages);
	
	
	        /* Calculate Section Height */
	        if (!Modernizr.touch) {
	            $window.resize(_.bind(function() {
	                var windowHeight = $window.height(),
	                    windowWidth = $window.width();
	                this.$('#article').height(windowHeight);
	                this.$('.full-height-section .site-block').height(windowHeight);
	                if (!this.$el.find('.landing-page').data('initialized')) {
	                    this.$el.find('.landing-page').css({
	                        display: 'none',
	                        visibility: 'visible'
	                    }).fadeIn(200, onInit);
	                }
	                this.$el.find('.grid').height(windowHeight-$(".site-header").height());
	                this.$el.find('.landing-page').data('initialized', 'initialized');
	                onResize();
	            }, this)).trigger('resize');
	        }else{
	            onInit();
	            onResize();
	        }
	
	        function onInit() {
	            $('select.selectmenu').selectmenu({
	                create: function() {
	                    if (window.PIE) {
	                        $('.ui-selectmenu, .ui-selectmenu-menu ul').each(function() {
	                            PIE.attach(this);
	                        });
	                    }
	                }
	            });
	
	            $('select.selectmenu-in-popup').selectmenu({
	                create: function() {
	                    if (window.PIE) {
	                        $('.ui-selectmenu, .ui-selectmenu-menu ul').each(function() {
	                            PIE.attach(this);
	                        });
	                    }
	                },
	                appendTo: 'form.convert-form'
	            });
	
	            $(".convert-form .ui-widget").mouseout(function(e) {
	                e.stopPropagation();
	            });
	
	            /*JS PIE. Fetures and usage: http://css3pie.com/documentation/supported-css3-features/*/
	            if (window.PIE) {
	                $('.button, .buttoned, input[type="text"], input[type="password"], textarea, .ui-selectmenu').each(function() {
	                    PIE.attach(this);
	                });
	            }


	            /*Animate planer form once*/
	            var windowWidth = $window.width();

	            $(".trigger-input-animation").one('click', function(){
			        if (windowWidth > 880){

			        	$('#plan').fadeOut(100, function() {

							$('#js-travel-planner-form').addClass('form-expanded').animate({
				                width:880
				            }, 500);
				            $('#plan-inputs-container').animate({
				                width:324
				            }, 500, function() {
								$('#plan').fadeIn(300);
								$('#js-travel-planner-form').addClass('this-has-expanded');
							});

						});

			        }else{

			        	$('#js-travel-planner-form').addClass('form-expanded');
	        			$('#plan-inputs-container').animate({
			                height:165
			            }, 500, function() {
								$('#plan').fadeIn(300);
								$('#js-travel-planner-form').addClass('this-has-expanded');
							});
			        }

			    });



	        }
	
	        function onResize() {

		        var windowWidth = $window.width();

		        if (windowWidth > 880){
		        	$('#query').attr("placeholder", "Your type of interest e.g.: horses, hiking, whale watching");
		        	animateSearchFormHorisontal = true;
		        }else{
		        	$('#query').attr("placeholder", "Your type of interest");
		        	animateSearchFormVertical = true;
		        }

	        }

	
	        /* Top slider */
	        initSlider('.home-section .next', '.home-section .prev', '.slider-container');


            this.$('input[type="submit"], input[type="button"], a').hoverIntent({
                over: function() {
                	$(this).toggleClass('hovered', 0, 'swing');
                },
                out: function() {
                	$(this).toggleClass('hovered', 0, 'swing');
                },
                interval: 0
            });

	        this.$("#team").waypoint(function(dir) {
	            if (dir == 'down') {
	                $bottom.css({
	                    visibility: 'visible'
	                });
	            } else {
	                $bottom.css({
	                    visibility: 'hidden'
	                });
	            }
	        });
	
		},


		numeric: function(e) {
		    var char = (e.which) ? e.which : e.keyCode;
		    return !(char > 31 && (char < 48 || char > 57));
		}

	});

});
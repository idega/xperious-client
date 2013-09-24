
define([
   'app',
   'view/index/destination/DestinationPopupView'
],function(
	app,
	DestinationPopupView) {


    function extractLast(term) {
		return term.split(' ').pop();
    }


	return Backbone.View.extend({

		template: 'index/index',


		events: {
			'click #destination' : 'destination',
			'click #plan' : 'plan',
			'keypress #budget' : 'numeric',
			'click #js-show-mobile-menu' : 'clickShowMobileMenu',
			'click #js-close-mobile-menu' : 'clickHideMobileMenu',
		},
		

		initialize: function() {
			_.bindAll(this);
			app.on('change:country', this.render, this);
		},
		

		cleanup: function() {
			app.off('change:country', this.render, this);
			$(window).off('resize', this.onResize);
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
            var teenagers = app.search.guests.get('teenagers');
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
                    teenagers: teenagers,
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


 		clickShowMobileMenu: function() {
	           
        	$("#home").animate({marginLeft: 240}, 300);
        	$("#home").css("width", $("#home").outerWidth());

        },

        clickHideMobileMenu: function() {
	           
        	$("#home").animate({marginLeft: 0}, 300, function(){
        		$("#home").css("width", 'auto');
        	});

        },

		parse: function(query) {
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

	        /* Placeholder for old browsers */
	        $('input[placeholder], textarea[placeholder]').placeholder();
	

			/* Autocomplete configuration for query field */
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
		                  $.getJSON(app.apihost + '/v1/keywords/suggest?country=' + app.country(), {
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
	
	
	        if (!Modernizr.touch) {
	            $window.resize(this.onResize).trigger('resize');
	        } else {
	            this.onInit();
	            this.handleMenu();
	        }


	        /* Top slider */
	        initSlider(
                '.home-section .next',
                '.home-section .prev',
                '.slider-container',
                0,
                function(src) {
                    // A hack because jQuery does not allow to work directly with
                    // css attributes for specified media type. This is required so
                    // responsive background is the same as in the full version.
                    $('#home-section-override').remove();
                    $('<style id="home-section-override" media="screen and (max-width: 960px)">' +
                        '.home-section {background-image: url(' + src + ');}' + 
                      '</style>')
                    .appendTo('head');
                });

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


		onResize: _.debounce(function() {

			var $window = $(window);
            var windowHeight = $window.height(), windowWidth = $window.width();

            this.$('#article').height(windowHeight);
            this.$('.full-height-section .site-block').height(windowHeight);
            if (!this.$el.find('.landing-page').data('initialized')) {
                this.$el.find('.landing-page').css({
                    display: 'none',
                    visibility: 'visible'
                }).fadeIn(200, this.onInit);
            }

            this.$el.find('.grid').height(windowHeight-$(".site-header").height());
            this.$el.find('.landing-page').data('initialized', 'initialized');

			var $selectMenu = $('select.selectmenu'), $selectMenuInPopup = $('select.selectmenu-in-popup');

            if ($selectMenu.data('selectmenu')) {
				$selectMenu.selectmenu('destroy');
            }

            if ($selectMenuInPopup.data('selectmenu')) {
            	$selectMenuInPopup.selectmenu('destroy');
            }

            this.initSelectMenus();

            this.handleMenu();

		}, 100, false),


		handleMenu: function() {

			var $window = $(window);
	        var windowWidth = $window.width();

	        if (windowWidth > 980) {
	        	$("#js-mobile-menu").css("width", '990px');
	        	$("#home").css("width", 'auto');
	        	$("#home").css('margin-left', '0px');

	    	} else if (windowWidth > 880) {

	        	$('#query').attr("placeholder", "Your type of interest e.g.: horses, hiking, whale watching");
	        	
	        	/*Home section and bottom menu if page is resized to wide and menu is opened*/
	        	$("#home").css("width", 'auto');
	        	$("#home").css('margin-left', '0px');
	        	$("#js-mobile-menu").css("width", 'auto');

	        } else {

	        	$('#query').attr("placeholder", "Your type of interest");

	        	/*Reset menu size only when menu is not opened*/
	        	var menuWidth = parseInt($("#js-mobile-menu").outerWidth(), 10);
	        	var openedMenuWidth = 240;

	        	if (menuWidth != openedMenuWidth){
	        		$("#js-mobile-menu").css("width", '0px');
	        	}		        		

	        	/*Home section width when mobile menu is opened*/
	        	$("#home").css("width", windowWidth);

	        }
        },
	

		initSelectMenus: function() {

			var $selectMenu = $('select.selectmenu'), $selectMenuInPopup = $('select.selectmenu-in-popup');

            $selectMenu.each(function(){
                var $selectM = $(this);
                $selectM.selectmenu({
                    create: function() {
                        if (window.PIE) {
                            $('.ui-selectmenu, .ui-selectmenu-menu ul').each(function() {
                                PIE.attach(this);
                            });
                        }
                    },
                    open: function(p) {
                        var $select = $(this),
                            $menu_button = $select.parent().find('a.ui-selectmenu'),
                            toTop = $menu_button.offset().top > $('.ui-selectmenu-menu').offset().top;

                        $menu_button.toggleClass('to-top', toTop);
                        $(".ui-selectmenu-menu-dropdown").toggleClass('to-top', toTop);
                        if (Modernizr.touch){
                            $(p.currentTarget).parent().siblings('select').show().focus().trigger('mousedown').on('change', function(){
                                //$selectM.selectmenu('value', $this.val());
                                initSelectMenus();
                            });
                            $('.ui-selectmenu').hide();
                        }
                    },
                    close: function(p) {
                        var $select = $(this),
                            $menu_button = $select.parent().find('a.ui-selectmenu');
                        $menu_button.removeClass('to-top');
                        $(".ui-selectmenu-menu-dropdown").removeClass('to-top');
                        if (Modernizr.touch){
                            $(p.currentTarget).parent().siblings('select').hide();
                            $('.ui-selectmenu').show();
                        }
                    }
                });
            });


		    $selectMenuInPopup.selectmenu({
                create: function() {
                    if (window.PIE) {
                        $('.ui-selectmenu, .ui-selectmenu-menu ul').each(function() {
                            PIE.attach(this);
                        });
                    }
                },
                appendTo: 'form.convert-form'
            });
        },


 		onInit: function() {

 			this.initSelectMenus();


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

		        	$('#js-travel-planner-form').animate({width: 822}, 200, function() {
						$('#js-travel-planner-form').addClass('form-expanded')
						$('#plan-inputs-container').animate({width: 322}, 500, function() {
							$('#plan').switchClass(undefined, 'animated', 200);
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
        },


		numeric: function(e) {
		    var char = (e.which) ? e.which : e.keyCode;
		    return !(char > 31 && (char < 48 || char > 57));
		}

	});

});
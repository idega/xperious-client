define([
    'app'
], function(
    app) {
    

    return Backbone.View.extend({

        template: 'index/guests/dialog',


        events: {
            'keypress .one-digit' : 'allowOneDigit',
            'change #children' : 'children',
            'change #infants' : 'infants',
            'change #seniors' : 'seniors'
        },


        initialize: function() {
            _.bindAll(this);
        },


        serialize: function() {
            return {
                guests: app.search.guests.toJSON()
            };
        },

        afterRender: function() {
    
            this.$el.dialog({
                dialogClass: 'guests',
                modal: false,
                resizable: false,
                width: 130,
                minWidth: 0,
                minHeight: 200,
                close: this.empty,
                position: {
                    my: 'top',
                    at: 'bottom',
                    of: $('.guest')
                }
            });


            // clicking on anything else except the 
            // dialog itself should close it
            $('html').bind('click', this.empty);
            this.$el.bind('click', function(e) {
                e.stopPropagation();
            });


            // recenter the dialog on window resize
            $(window).resize(this.updatePosition);
        },

        allowOneDigit: function(e) {
            var val = $(e.currentTarget).val();

            if (val.length == 1) {
                e.preventDefault();

            } else {
                var char = (e.which) ? e.which : e.keyCode;
                return !(char > 31 && (char < 48 || char > 57));
            }

        },

        children: function(e) {
            app.search.guests.set('children', parseInt(this.$('#children').val()));
        },

        infants: function(e) {
            app.search.guests.set('infants', parseInt(this.$('#infants').val()));
        },

        seniors: function(e) {
            app.search.guests.set('seniors', parseInt(this.$('#seniors').val()));
        },

        updatePosition: _.debounce(function() {
            this.$el.dialog(
                "option", 
                "position", {
                    my: 'top',
                    at: 'bottom',
                    of: $('.guest')
            });
        }, 100, false),


        empty: function() {
            this.$el.dialog('close');
            this.$el.remove();
            $(window).unbind('resize', this.updatePosition);
            $('html').unbind('click', this.empty);
        },

    });

});
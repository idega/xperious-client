define([
    'app',
    'view/index/guests/GuestsDialogView',
], function(
    app, 
    GuestsDialogView) {
    

    return Backbone.View.extend({

        template: 'index/guests/guests',


        events: {
            'keypress #adults' : 'checkNumber',
            'change #adults' : 'adults',
            'focus #adults' : 'focusWithClick',
            'click #more' : 'showDialog'
        },


        initialize: function() {
        },


        focusWithClick: function(e) {
            $('#adults').trigger('click');
        },


        serialize: function() {
            return {
                guests: app.search.guests.toJSON()
            };
        },

        showDialog: function(e) {
            e.stopPropagation();
            new GuestsDialogView().render();
        },

        adults: function(e) {
            app.search.guests.set('adults', parseInt(this.$('#adults').val()));
        },

        checkNumber: function(e) {
            var char = (e.which) ? e.which : e.keyCode;
            return !(char > 31 && (char < 48 || char > 57));
        }
    });

});
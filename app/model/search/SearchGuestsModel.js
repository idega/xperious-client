define([
    'app'
], function(
    app) {
    

    return Backbone.Model.extend({
        defaults: {
            adults: 2,
            children: 0,
            infants: 0,
            seniors: 0
        }
    });


});
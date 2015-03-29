import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function () {
        var self = this,
            initial = this.initial || null;

        this.$("#select-star-rating").val(initial).barrating({
            showSelectedRating: false,
            onSelect: function (value, text) {
                self.send('onSelect', value, text);
            },
        });
    },
    ratings: function () {
        var maximum = this.get('maximum') || 5;
        var ratingMapper = function (i) {
            return {text: (i+1).toString(), value: i+1};
        };
        return Array.apply(null, {length: maximum}).map(Function.call, ratingMapper);
    }.property('maximum'),
    actions: {
        onSelect: function (value, text) {
            this.sendAction('onRating', value, text);
        },
    }
});

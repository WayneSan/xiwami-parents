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
    actions: {
        onSelect: function (value, text) {
            this.sendAction('onRating', value, text);
        },
    }
});

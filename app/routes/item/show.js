import Ember from 'ember';

export default Ember.Route.extend({
    model: function(params) {
        return this.store.findRecord('item', params.id);
    },

    actions: {
        goBack: function() {
            var self = this,
                session = self.get('session'),
                previousURL = self.controllerFor('application').get('previousURL');

            if (previousURL) {
                self.transitionTo(previousURL);
            } else {
                self.transitionTo('item.browse');
            }
        },

        deleteByAdmin: function(id) {
            var self = this;

            self.store.findRecord('item', id).then(function (record) {
                record.destroyRecord();
                self.transitionTo('item.browse');
            });
        }
    }
});

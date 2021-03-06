import Ember from 'ember';

export default Ember.Route.extend({
    model: function(params) {
        return this.store.findRecord('group', params.id);
    },

    actions: {
        goBack: function() {
            var self = this,
                session = self.get('session'),
                previousURL = self.controllerFor('application').get('previousURL');

            if (previousURL) {
                self.transitionTo(previousURL);
            } else {
                self.transitionTo('group.my');
            }
        },

        showList: function() {
            var self = this;

            self.controller.set('showList', true);
            self.controller.set('showAddNew', false);
        },

        showAddNew: function() {
            var self = this;

            self.controller.set('showList', false);
            self.controller.set('showAddNew', true);
        }
    }
});

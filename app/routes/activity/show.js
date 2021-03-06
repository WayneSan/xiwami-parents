import Ember from 'ember';

export default Ember.Route.extend({
    model: function(params) {
        return this.store.findRecord('activity', params.id);
    },

    setupController: function(controller, model) {
        var self = this,
            userId = self.get('session.secure.id');

        controller.set('content', model);

        if (userId) {
            var query = {
                member: userId,
                event: model.id
            };

            self.store.query('emaction', query).then(function(emactions) {
                controller.set('emaction', emactions.content[0]);
            });
        }
    },

    actions: {
        goBack: function() {
            var self = this,
                session = self.get('session'),
                previousURL = self.controllerFor('application').get('previousURL');

            if (previousURL) {
                self.transitionTo(previousURL);
            } else {
                self.transitionTo('activity.browse');
            }
        },

        setAction: function(selectedValue) {
            var self = this,
                userId = self.get('session.secure.id'),
                model = self.currentModel,
                emaction = self.controller.get('emaction');

            if (emaction) {
                emaction.set('action', selectedValue);
                emaction.save();
            } else {
                self.store.find('member', userId).then(function(user) {
                    var newRecord = self.store.createRecord('emaction', {
                        event: model,
                        member: user,
                        action: selectedValue,
                        createdDate: new Date()
                    });

                    newRecord.save();
                });                
            }
        }
    }
});

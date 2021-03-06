import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        var self = this,
            appController = self.controllerFor('application'),
            userId = self.get('session.secure.id');

        return this.store.query('feed', {
            requester: userId,
            longitude: appController.get('baseLongitude'),
            latitude: appController.get('baseLatitude')
        });
    },

    setupController: function(controller, model) {
        controller.set('feeds', model);
        controller.set('isHidingPostBoxReal', true)
    },

    _saveNewFeed: function _saveNewFeed(self, title, description) {
        var session = self.get('session'),
            userId = self.get('session.secure.id');

        self.store.find('member', userId).then(function(member) {
            var newObj = self.store.createRecord('feed', {
                title: title,
                description: description,
                createdDate: new Date(),
                creator: member,
                city: session.get('baseCity'),
                state: session.get('baseState'),
                zipCode: session.get('zipCode')
            });

            newObj.save().then(function(obj) {
                self.controller.set('title', '');
                self.controller.set('description', '');
                self.refresh();
            });
        });
    },

    actions: {
        hidePostBoxFake: function() {
            this.controller.set('isHidingPostBoxReal', false);
        },

        hidePostBoxReal: function(title, description) {
            var self = this;

            self.controller.set('isHidingPostBoxReal', true);
            self.controller.set('isHidingPostBoxFake', false);

            if (!Ember.isEmpty(title) && !Ember.isEmpty(description)) {
                self._saveNewFeed(self, title, description);
            }
        },

        reply: function(parentId) {
            var self = this,
                userId = self.get('session.secure.id'),
                newObj;

            self.store.findRecord('member', userId).then(function(member) {
                newObj = self.store.createRecord('feedback', {
                    creator: member,
                    parent: parentId,
                    parentType: 'feed',
                    createdDate: new Date(),
                    description: self.controller.get('replyText'),
                    viewCount: 0,
                    likeCount: 0,
                    city: member.get('city'),
                    state: member.get('state'),
                    isDeletedRecord: false
                });

                newObj.save().then(function (feedback) {
                    self.refresh();

                    self.controller.set('replyText', '');
                }, function (error) {
                    self.send('error', error);
                });
            });
        }
    }
});

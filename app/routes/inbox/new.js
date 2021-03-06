import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function (params) {
      var self = this;

      if (Ember.isEmpty(params.toId)) {
          return Ember.RSVP.hash({
              message: self.store.createRecord('message'),
              members: self.store.findAll('member')
          });
      } else {
          return Ember.RSVP.hash({
              message: self.store.createRecord('message'),
              members: self.store.findAll('member'),
              toId: params.toId,
              rootMessage: params.rootMessage
          });
      }
  },

  setupController: function(controller, model) {
      if (!Ember.isEmpty(model.toId)) {
          controller.set('selectedToId', model.toId);
      }



      controller.set('model', model);
  },

  actions: {
      cancel: function () {
          var self        = this,
              session     = self.get('session'),
              previousURL = self.controllerFor('application').get('previousURL');

          if (previousURL) {
              self.transitionTo(previousURL);
          } else {
              self.transitionTo('inbox.browse');
          }
      },

      save: function () {
          var self   = this,
              model  = self.currentModel.message,
              toId = self.controller.get('selectedToId'),
              userId = self.get('session.secure.id');

          if (!Ember.isEmpty(toId)) {
              self.store.findRecord('member', userId).then(function (fromUser) {
                  self.store.findRecord('member', toId).then(function (toUser) {
                      self.store.findRecord('message', self.currentModel.rootMessage).then(function (message){
                          model.set('from', fromUser);
                          model.set('to', toUser);
                          model.set('fromStatus', 'sent');
                          model.set('toStatus', 'unread');
                          model.set('rootMessage', message);
                          model.set('isDeletedRecord', false);
                          model.set('createdDate', new Date());

                          var onSuccess = function (item) {
                              self.transitionTo('inbox.browse');
                          };

                          var onFail = function (error) {
                              self.send('error', error);
                          };

                          model.save().then(onSuccess, onFail);
                      });
                  });
              });
          } else {
              self.send('error', 'Please select a recipient');
          }
      }
  }
});

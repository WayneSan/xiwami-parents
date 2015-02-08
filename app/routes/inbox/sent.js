import Ember from 'ember';

export default Ember.Route.extend({
    model: function () {
        var self = this,
            session = self.get('session'),
            user = session.get('user');

        return self.store.find('message', { from: user.id, fromStatus: 'sent' });
    }
});
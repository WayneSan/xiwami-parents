import Ember from 'ember';

export default Ember.ObjectController.extend({
    showAlert: false,
    alertTitle: "",
    alertMessage: "",
    alertType: "",
    
    disabledImportFacebook: function () {
        return Ember.isEmpty(this.get('facebookId'));
    }.property('facebookId'),

    hasOldPassword: function() {
        var pass = this.get('password'),
            ret = false;
        if (pass) {
            if (pass !== '') {
                ret = true;
            }
        }
        return ret;
    }.property('password'),

    _toggleAlert: function(flag, title, message, type) {
        var self = this;
        self.set('showAlert', flag);
        self.set('alertTitle', title);
        self.set('alertMessage', message);
        self.set('alertType', type);
    },

    deactivate: function() {
        var self = this;
        self._toggleAlert(false);
    },

    actions: {
        save: function () {
            var self = this,
                fromModel = this.get('model'),
                hasError = false;

            self._toggleAlert(false);
            var onSuccess = function () {
                self._toggleAlert(true, 'Success', 'Your account info has been saved.', 'alert-success');
            };

            var onFail = function () {
                self._toggleAlert(true, 'Error', 'while saving data.', 'alert-danger');
            };

            if (self.get('newPassword')) {
                if (self.get('newPassword') !== self.get('newPassword2') ) {
                    self._toggleAlert(true, 'Error', 'New passwords must match.', 'alert-danger');
                    hasError = true;
                } else {
                    if (self.get('password')) {
                        if (self.get('password') === self.get('oldPassword')) {
                            fromModel.set('password', self.get('newPassword'));
                        } else {
                            self._toggleAlert(true, 'Error', 'Old password is wrong.', 'alert-danger');
                            hasError = true;
                        }
                    } else {
                        // user has no password yet, so as long as the new passwords match, we save it
                        fromModel.set('password', self.get('newPassword'));
                    }
                }
            }

            if (!hasError) {
                fromModel.save().then(onSuccess, onFail);
            }
        },

        cancel: function() {
            var handlers = this.get('target').router.oldState.handlerInfos,
                handler = handlers[handlers.length-1];

            if (handler) {
                this.get('target').transitionTo(handler.name);
            } else {
                this.get('target').transitionTo('index');
            }
        },

        importFromFacebook: function () {
            var self = this,
                fromModel = self.get('model');

            FB.api('/me?fields=id,name,address,email,birthday', function (fbUser) {
                if (!fromModel.get('email')) {
                    fromModel.set('email', fbUser.email);
                }

                if (!fromModel.get('facebookId')) {
                    fromModel.set('facebookId', fbUser.id);
                }
            });
        },

        closeAlert: function() {
            var self = this;
            self._toggleAlert(false);
        }
    }
});

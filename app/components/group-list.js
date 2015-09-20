import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function () {
        var self = this;

        self.$("#dialog-confirm-delete").dialog({
            autoOpen: false,
            resizable: false,
            appendTo: '#' + self.get('elementId'),
            height: 240,
            modal: true,
            buttons: {
                Delete: function () {
                    var id = self.$(this).data('id');
                    self.$(this).dialog("close");
                    self.sendAction('delete', id);
                },
                Cancel: function () {
                    self.$(this).dialog("close");
                }
            }
        });
    },
    actions: {
        openDeleteDialog: function (id) {
            var self = this;

            self.$("#dialog-confirm-delete").data('id', id).dialog("open");
        }
    }
});

import Ember from 'ember';
import CommonDataMixin from '../../mixins/common-data';
import ActivityDataMixin from '../../mixins/activity-data';

export default Ember.ObjectController.extend(CommonDataMixin, ActivityDataMixin, {

});

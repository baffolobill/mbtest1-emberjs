import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['notification_center'],
    componentsResultsLoader: function() {
        return this.get('model').getComponentsLoader();
    }.property('model')
});

import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['notification_center'],
    propertiesResultsLoader: function() {
        return this.get('model').getPropertiesLoader();
    }.property('model')
});

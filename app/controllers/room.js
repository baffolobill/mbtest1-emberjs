import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['notification_center'],
    serversResultsLoader: function() {
        return this.get('model').getServersLoader();
    }.property('model')
});

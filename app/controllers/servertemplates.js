import Ember from 'ember';

export default Ember.Controller.extend({
    needs: ['application'],

    resultsLoader: Ember.computed.oneWay('model')
});

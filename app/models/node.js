import DS from 'ember-data';
//import Model from './core/model';
import EmberValidations from 'ember-validations';

var getResultsLoader = function(loaderClassName, attributes) {
    return MbTestApp.__container__.lookupFactory("results-loader:" + loaderClassName).create(attributes);
};

var generateResultsLoader = function(loaderClassName, uriFieldName) {
    return function(attributes) {
        attributes = _.extend({
            path: this.get(uriFieldName)
        }, attributes);
        return getResultsLoader(loaderClassName, attributes);
    };
};

var Node = DS.Model.extend(EmberValidations, {
    validations: {
        name: {
            presence: true
        },
        address: {
            presence: true
        }
    },

    uri: '/nodes',
    route_name: 'nodes',
    type_name: 'Node',

    name: DS.attr('string'),
    address: DS.attr('string'),

    //floors: DS.hasMany('floor', { async: true }),
    //racks: DS.hasMany('rack', { async: true }),
    //servers: DS.hasMany('server', { async: true }),

    /*servers_count: function(){
        return this.get('servers').get('length');
    }.property('servers'),*/


    getServersLoader: generateResultsLoader("servers", "servers_uri"),

    servers_uri: function() {
        return this.get('uri')+'/'+this.get('id')+'/servers';
    }.property('uri', 'id'),
});


export default Node;

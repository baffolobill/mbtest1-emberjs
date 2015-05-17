//import DS from 'ember-data';
import Ember from "ember";
import Model from './core/model';
import { generateResultsLoader } from "../utils/model";


var Node = Model.extend(Ember.Validations, {
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
    type_plural: 'Nodes',

    //name: DS.attr('string'),
    //address: DS.attr('string'),

    //floors: DS.hasMany('floor', { async: true }),
    //racks: DS.hasMany('rack', { async: true }),
    //servers: DS.hasMany('server', { async: true }),

    /*servers_count: function(){
        return this.get('servers').get('length');
    }.property('servers'),*/

    servers: Model.hasMany('servers', 'server'),


    getServersLoader: generateResultsLoader("servers", "servers_uri"),
    getResultsLoader: generateResultsLoader("nodes", "uri"),

    servers_uri: function() {
        return '/nodes/'+this.get('id')+'/servers';
    }.property('uri', 'id'),
});


export default Node;

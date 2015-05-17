import Ember from "ember";
import Model from "./core/model";
import { generateResultsLoader } from "../utils/model";

export default Model.extend(Ember.Validations, {
    validations: {
        name: {
            presence: true
        },
        node: {
            presence: true
        }
    },
    /*name: DS.attr('string'),
    node: DS.belongsTo('node', { async: true }),
    rooms: DS.hasMany('room', { async: true })*/
    uri: '/floors',
    route_name: 'floors',
    type_name: 'Floor',
    type_plural: 'Floors',

    node_name: function() {
        var node = this.get('json_node');
        if (node) {
            return node.name;
        }
        return '---';
    }.property('json_node'),

    json_node: function() {
        var json = this.get('__json');
        var self = this;
        if (json) {
            return json.node;
        }
        this.reload().then(function() {
            return self.get('__json').node;
        });
    }.property('__json'),

    //node: Model.belongsTo('node', 'nodes'),
    getServersLoader: generateResultsLoader("servers", "servers_uri"),
    getResultsLoader: generateResultsLoader("floors", "uri"),

    servers_uri: function() {
        return this.get('uri')+'/servers';
    }.property('uri'),
});

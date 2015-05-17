import Ember from "ember";
import Model from "./core/model";
import { generateResultsLoader } from "../utils/model";

export default Model.extend(Ember.Validations, {
    validations: {
        name: {
            presence: true
        },
        floor: {
            presence: true
        }
    },

    /*name: DS.attr('string'),
    floor: DS.belongsTo('floor', { async: true }),
    rows: DS.hasMany('row', { async: true })*/
    uri: '/rooms',
    route_name: 'rooms',
    type_name: 'Room',
    type_plural: 'Rooms',

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

    floor_name: function() {
        var obj = this.get('json_floor');
        if (obj) {
            return obj.name;
        }
        return '---';
    }.property('json_floor'),

    json_floor: function() {
        var json = this.get('__json');
        var self = this;
        if (json) {
            return json.floor;
        }
        this.reload().then(function() {
            return self.get('__json').floor;
        });
    }.property('__json'),

    //floor: Model.belongsTo('floor', 'floors'),
    getServersLoader: generateResultsLoader("servers", "servers_uri"),
    getResultsLoader: generateResultsLoader("rooms", "uri"),

    servers_uri: function() {
        return this.get('uri')+'/servers';
    }.property('uri'),
});

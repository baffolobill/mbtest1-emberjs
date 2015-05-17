import Ember from "ember";
import Model from "./core/model";
import { generateResultsLoader } from "../utils/model";

export default Model.extend(Ember.Validations, {
    validations: {
        name: {
            presence: true
        },
        row: {
            presence: true
        },
        total_units: {
            presence: true
        }
    },
    /*name: DS.attr('string'),
    node: DS.belongsTo('node', { async: true }),
    row: DS.belongsTo('row', { async: true }),
    total_units: DS.attr('number'),
    max_gap: DS.attr('number'),
    units: DS.hasMany('unit', { async: true }),
    servers: DS.hasMany('server', { async: true })*/
    uri: '/racks',
    route_name: 'racks',
    type_name: 'Rack',
    type_plural: 'Racks',

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

    json_room: function() {
        var json = this.get('__json');
        var self = this;
        if (json) {
            return json.room;
        }
        this.reload().then(function() {
            return self.get('__json').room;
        });
    }.property('__json'),

    json_row: function() {
        var json = this.get('__json');
        var self = this;
        if (json) {
            return json.row;
        }
        this.reload().then(function() {
            return self.get('__json').row;
        });
    }.property('__json'),

    getResultsLoader: generateResultsLoader("racks", "uri"),
    getServersLoader: generateResultsLoader("servers", "servers_uri"),

    servers_uri: function() {
        return this.get('uri')+'/servers';
    }.property('uri'),
});

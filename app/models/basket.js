import Ember from "ember";
import Model from "./core/model";
import { generateResultsLoader } from "../utils/model";

export default Model.extend(Ember.Validations, {
    validations: {
        name: {
            presence: true
        },
        rack: {
            presence: true
        },
        slot_qty: {
            presence: true
        },
        unit_takes: {
            presence: true
        }
    },
    /*name: DS.attr('string'),
    rack: DS.belongsTo('rack'),
    slot_qty: DS.attr('number'),
    unit_takes: DS.attr('number'),
    servers: DS.hasMany('server')*/
    uri: '/baskets',
    route_name: 'baskets',
    type_name: 'Basket',
    type_plural: 'Baskets',

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

    json_rack: function() {
        var json = this.get('__json');
        var self = this;
        if (json) {
            return json.rack;
        }
        this.reload().then(function() {
            return self.get('__json').rack;
        });
    }.property('__json'),

    getResultsLoader: generateResultsLoader("baskets", "uri"),
    getServersLoader: generateResultsLoader("servers", "servers_uri"),

    servers_uri: function() {
        return this.get('uri')+'/servers';
    }.property('uri'),
});

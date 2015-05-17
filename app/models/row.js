import Ember from "ember";
import Model from "./core/model";
import { generateResultsLoader } from "../utils/model";

export default Model.extend(Ember.Validations, {
    validations: {
        name: {
            presence: true
        },
        room: {
            presence: true
        }
    },
    /*name: DS.attr('string'),
    room: DS.belongsTo('room', { async: true }),
    racks: DS.hasMany('rack', { async: true })*/
    uri: '/rows',
    route_name: 'rows',
    type_name: 'Row',
    type_plural: 'Rows',

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

    getServersLoader: generateResultsLoader("servers", "servers_uri"),
    getResultsLoader: generateResultsLoader("rows", "uri"),

    servers_uri: function() {
        return this.get('uri')+'/servers';
    }.property('uri'),
});

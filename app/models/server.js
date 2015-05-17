import Ember from "ember";
import Model from "./core/model";
import { generateResultsLoader } from "../utils/model";

export default Model.extend(Ember.Validations, {
    validations: {
        name: {
            presence: true
        },
        template: {
            presence: true
        }
    },
    uri: '/servers',
    route_name: 'servers',
    type_name: 'Server',
    type_plural: 'Servers',

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

    json_basket: function() {
        var json = this.get('__json');
        var self = this;
        if (json) {
            return json.basket;
        }
        this.reload().then(function() {
            return self.get('__json').basket;
        });
    }.property('__json'),

    json_template: function() {
        var json = this.get('__json');
        var self = this;
        if (json) {
            return json.template;
        }
        this.reload().then(function() {
            return self.get('__json').template;
        });
    }.property('__json'),

    getResultsLoader: generateResultsLoader("servers", "uri"),
    getComponentsLoader: generateResultsLoader("components", "components_uri"),

    components_uri: function() {
        return this.get('uri')+'/components';
    }.property('uri'),
});

import Ember from "ember";
import Model from "./core/model";
import { generateResultsLoader } from "../utils/model";

export default Model.extend(Ember.Validations, {
    validations: {
        name: {
            presence: true
        },
        manufacturer: {
            presence: true
        },
        model_name: {
            presence: true
        },
        serial_number: {
            presence: true
        },
        kind: {
            presence: true
        }
    },
    uri: '/components',
    route_name: 'components',
    type_name: 'Component',
    type_plural: 'Components',

    json_kind: function() {
        var json = this.get('__json');
        var self = this;
        if (json) {
            return json.kind;
        }
        this.reload().then(function() {
            return self.get('__json').kind;
        });
    }.property('__json'),

    json_server: function() {
        var json = this.get('__json');
        var self = this;
        if (json) {
            return json.server;
        }
        this.reload().then(function() {
            return self.get('__json').server;
        });
    }.property('__json'),

    getResultsLoader: generateResultsLoader("components", "uri"),
    getPropertiesLoader: generateResultsLoader("properties", "properties_uri"),

    properties_uri: function() {
        return this.get('uri') + '/properties';
    }.property('uri'),
});

import Ember from "ember";
import Model from "./core/model";
import { generateResultsLoader } from "../utils/model";

export default Model.extend(Ember.Validations, {
    validations: {
        name: {
            presence: true
        },
        cpu_socket: {
            presence: true
        },
        cpu_qty: {
            presence: true
        },
        ram_standard: {
            presence: true
        },
        ram_qty: {
            presence: true
        },
        unit_takes: {
            presence: true
        }
    },
    /*name: DS.attr('string'),
    cpu_socket: DS.belongsTo('property-option', { async: true }),
    cpu_qty: DS.attr('number'),
    ram_standard: DS.belongsTo('property-option', { async: true }),
    ram_qty: DS.attr('number'),
    unit_takes: DS.attr('number'),
    hdds: DS.hasMany('server-template-hdd', { async: true })*/
    uri: '/servertemplates',
    route_name: 'servertemplates',
    type_name: 'ServerTemplate',
    type_plural: 'ServerTemplates',

    json_cpu_socket: function() {
        var json = this.get('__json');
        var self = this;
        if (json) {
            return json.cpu_socket;
        }
        this.reload().then(function() {
            return self.get('__json').cpu_socket;
        });
    }.property('__json'),

    json_ram_standard: function() {
        var json = this.get('__json');
        var self = this;
        if (json) {
            return json.ram_standard;
        }
        this.reload().then(function() {
            return self.get('__json').ram_standard;
        });
    }.property('__json'),

    getResultsLoader: generateResultsLoader("servertemplates", "uri"),
    getServersLoader: generateResultsLoader("servers", "servers_uri"),

    servers_uri: function() {
        return this.get('uri')+'/servers';
    }.property('uri'),
});

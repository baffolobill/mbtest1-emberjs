import Ember from "ember";
import Model from './core/model';
import { generateResultsLoader } from "../utils/model";
import ModelArray from "./core/model-array";

export default Model.extend(Ember.Validations, {
    validations: {
        name: {
            presence: true
        }
    },

    uri: '/properties',
    route_name: 'properties',
    type_name: 'PropertyOption',
    type_plural: 'PropertyOptions',

    getCPUSockets: function() {
        return ModelArray.newArrayLoadedFromUri(this.get('cpusockets_uri'), 'PropertyOptions');
    },

    cpusockets_uri: function() {
        return '/properties/cpu.socket/options';
    }.property(),

    getRAMStandards: function() {
        return ModelArray.newArrayLoadedFromUri(this.get('ramstandards_uri'), 'PropertyOptions');
    },

    ramstandards_uri: function() {
        return '/properties/ram.standard/options';
    }.property(),

    getHDDFormFactors: function() {
        return ModelArray.newArrayLoadedFromUri(this.get('hddformfactors_uri'), 'PropertyOptions');
    },

    hddformfactors_uri: function() {
        return '/properties/hdd.form_factor/options';
    }.property(),

    getHDDConnectionType: function() {
        return ModelArray.newArrayLoadedFromUri(this.get('hddconnectiontype_uri'), 'PropertyOptions');
    },

    hddconnectiontype_uri: function() {
        return '/properties/hdd.connection_type/options';
    }.property(),
});

import Ember from "ember";
import Model from './core/model';
import { generateResultsLoader } from "../utils/model";

export default Model.extend(Ember.Validations, {
    validations: {
        name: {
            presence: true
        }
    },

    uri: '/properties',
    route_name: 'properties',
    type_name: 'Property',
    type_plural: 'Properties',

    getOptionsLoader: generateResultsLoader("propertyoptions", "options_uri"),

    options_uri: function() {
        return this.get('uri')+'/options';
    }.property('uri'),
});

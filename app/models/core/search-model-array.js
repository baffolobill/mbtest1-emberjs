import Ember from "ember";
//import Computed from "mb-test-1/utils/computed";
import ModelArray from "./model-array";

var readOnly = function(type) {
    return Ember.computed.readOnly('counts.' + type);
};

var SearchModelArray = ModelArray.extend(Ember.SortableMixin, {
    //total_servers: readOnly('server'),
    //total_results: Computed.sumAll('total_servers')
});

export default SearchModelArray;

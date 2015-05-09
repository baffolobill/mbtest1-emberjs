import Utils from "mb-test-1/lib/utils";
import Ember from "ember";
import ModelArray from "../core/model-array";
import SearchModelArray from "../core/search-model-array";
import ResultsLoaderQueryStringBuilder from "./results-loader-query-string-builder";

export default Ember.Object.extend({
    limit: 50,
    sort: function() {
        return this.get("sortField") + "," + this.get("sortDirection");
    }.property("sortField", "sortDirection"),

    setSortField: function(field) {
        var oldValue = this.get("sortField");
        var direction = "desc";
        if (field === oldValue) {
            direction = this.get("sortDirection") === "asc" ?
                "desc" :
                "asc";
        }
        this.setProperties({
            sortDirection: direction,
            sortField: field
        });
    },

    sortDirection: "desc",
    sortField: "created_at",

    resultsUri: function() {
        var path = this.get("path");
        var query = this.get("queryStringArguments");

        if (path === undefined) {
            return undefined;
        } else {
            return Utils.buildUri(path, query);
        }
    }.property("path", "queryStringArguments"),

    queryString: function() {
        return Utils.objectToQueryString(this.get("queryStringArguments"));
    }.property("queryStringArguments"),

    results: function() {
        var uri = this.get('resultsUri');
        var type = this.get('resultsType');

        Ember.Logger.debug("results-loaders.base.results: uri=", uri);

        if (Ember.isBlank(uri)) {
            return ModelArray.create({
                isLoaded: true
            });
        } else {
            /*var searchArray = SearchModelArray.newArrayLoadedFromUri(uri, type);
            searchArray.setProperties({
                sortProperties: [this.get('sortField') || 'created_at'],
                sortAscending: this.get('sortDirection') === 'asc'
            });
            return searchArray;*/
            var store = MbTestApp.__container__.lookup("store:main");
            return store.find('server', { node_id: 1 });
        }
    }.property("resultsUri", "resultsType", "sortField", "sortDirection"),

    isLoading: Ember.computed.not("results.isLoaded"),

    queryStringArguments: function() {
        var queryStringBuilder = new ResultsLoaderQueryStringBuilder();
        queryStringBuilder.addValues({
            limit: this.get("limit"),
            sort: this.get("sort"),

            type: this.get("typeFilters"),
            status: this.get("statusFilters"),
            method: this.get("methodFilters"),
            endpoint: this.get("endpointFilters"),
            status_rollup: this.get("statusRollupFilters"),

            "created_at[>]": this.get("startTime"),
            "created_at[<]": this.get("endTime"),

            q: this.get("searchQuery")
        });

        return queryStringBuilder.getQueryStringAttributes();
    }.property("sort", "startTime", "endTime", "typeFilters", "statusFilters", "endpointFilters", "statusRollupFilters", "limit")
});
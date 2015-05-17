export function getResultsLoader(loaderClassName, attributes) {
    return MbTestApp.__container__.lookupFactory("results-loader:" + loaderClassName).create(attributes);
}

export function generateResultsLoader(loaderClassName, uriFieldName) {
    return function(attributes) {
        attributes = _.extend({
            path: this.get(uriFieldName)
        }, attributes);
        return getResultsLoader(loaderClassName, attributes);
    };
}

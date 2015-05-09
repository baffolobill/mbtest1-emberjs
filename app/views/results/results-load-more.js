import Ember from "ember";

export default Ember.View.extend({
    tagName: "tfoot",
    templateName: "results/results-load-more",
    actions: {
        loadMore: function(results) {
            results.loadNextPage();
        }
    }
});

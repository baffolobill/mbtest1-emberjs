import Utils from "mb-test-1/lib/utils";
import Ember from "ember";

export default Ember.Route.extend({
    title: 'Model',

    pageTitle: function(route, setTitle) {
        var model = route.controller.get("content");
        var title = route.get('title');

        return Utils.maybeDeferredLoading(model, setTitle, function() {
            return title + ': loading ...';
        }, function() {
            return title + ': %@'.fmt(model.get('page_title'));
        });
    }
});

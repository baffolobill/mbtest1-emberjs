import TitleRoute from "./title";
import Utils from "mb-test-1/lib/utils";

export default TitleRoute.extend({
    model: function(params) {
        /*var marketplace = this.modelFor('marketplace');
        var modelObject = this.get('modelObject');
        var uri = this.get('marketplaceUri');

        return marketplace.then(function(marketplace) {
            var modelUri = Utils.combineUri(marketplace.get(uri), params.item_id);
            return modelObject.find(modelUri);
        });*/
        var modelObject = this.get('modelObject');
        var modelUri = params.item_id;
        console.log('TitleRoute:model: before return');
        return modelObject.find(modelUri);
    }
});

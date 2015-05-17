import TitleRoute from "./title";
import Basket from "../models/basket";

export default TitleRoute.extend({
    title: 'Basket List',
    model: function(params) {
        var instance = Basket.create();
        return instance.getResultsLoader();
    }
});

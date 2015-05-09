import Ember from "ember";
import LinkedTextCellView from "./linked-text-cell";

export default LinkedTextCellView.extend({
    title: Ember.computed.oneWay("labelText"),
});

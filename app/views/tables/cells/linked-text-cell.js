import Ember from "ember";
import TableCellBaseView from "./table-cell-base";

export default TableCellBaseView.extend({
    templateName: "tables/cells/linked-text-cell",
    blankText: 'none',
    attributeBindings: ['title'],
    isBlank: Ember.computed.empty('labelText'),
    displayValue: function() {
        if (this.get('isBlank')) {
            return this.get('blankText');
        } else {
            return this.get('labelText');
        }
    }.property('blankText', 'isBlank', 'labelText'),
});

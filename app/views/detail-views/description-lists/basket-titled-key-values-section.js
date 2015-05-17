import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

export default TitledKeyValuesSectionView.extend({
    title: "Basket information",
    editModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/basket-update-modal");
    }.property("model"),

    deleteModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/basket-delete-modal");
    }.property("model"),

    keyValueListViews: ListValueGenerator.create()
        .add('Basket ID', 'id')
        .add("Name", "name")
        .add("Total slots Qty", "slot_qty")
        .add("Height in units", "unit_takes")
        .add("Node name", "json_node.name")
        .add("Floor name", "json_floor.name")
        .add("Room name", "json_room.name")
        .add("Row name", "json_row.name")
        .add("Rack name", "json_rack.name")
        .toProperty()
});

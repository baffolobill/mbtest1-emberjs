import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

export default TitledKeyValuesSectionView.extend({
    title: "Rack information",
    editModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/rack-update-modal");
    }.property("model"),

    deleteModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/rack-delete-modal");
    }.property("model"),

    keyValueListViews: ListValueGenerator.create()
        .add('Rack ID', 'id')
        .add("Name", "name")
        .add("Total units", "total_units")
        .add("Max gap", "max_gap")
        .add("Node name", "json_node.name")
        .add("Floor name", "json_floor.name")
        .add("Room name", "json_room.name")
        .add("Row name", "json_row.name")
        .toProperty()
});

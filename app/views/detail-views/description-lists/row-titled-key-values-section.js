import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

export default TitledKeyValuesSectionView.extend({
    title: "Row information",
    editModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/row-update-modal");
    }.property("model"),

    deleteModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/row-delete-modal");
    }.property("model"),

    keyValueListViews: ListValueGenerator.create()
        .add('Row ID', 'id')
        .add("Name", "name")
        .add("Node name", "json_node.name")
        .add("Floor name", "json_floor.name")
        .add("Room name", "json_room.name")
        .toProperty()
});

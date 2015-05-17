import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

export default TitledKeyValuesSectionView.extend({
    title: "Room information",
    editModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/room-update-modal");
    }.property("model"),

    deleteModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/room-delete-modal");
    }.property("model"),

    keyValueListViews: ListValueGenerator.create()
        .add('Room ID', 'id')
        .add("Name", "name")
        .add("Node name", "node_name")
        .add("Floor name", "floor_name")
        .toProperty()
});

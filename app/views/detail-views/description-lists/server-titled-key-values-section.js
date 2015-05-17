import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

export default TitledKeyValuesSectionView.extend({
    title: "Server information",
    editModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/server-update-modal");
    }.property("model"),

    deleteModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/server-delete-modal");
    }.property("model"),

    keyValueListViews: ListValueGenerator.create()
        .add('Server ID', 'id')
        .add("Name", "name")
        .add("Template", "json_template.name")
        .add("Node name", "json_node.name")
        .add("Floor name", "json_floor.name")
        .add("Room name", "json_room.name")
        .add("Row name", "json_row.name")
        .add("Rack name", "json_rack.name")
        .add("Basket name", "json_basket.name")
        .toProperty()
});

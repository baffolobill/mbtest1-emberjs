import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

export default TitledKeyValuesSectionView.extend({
    title: "Component information",
    editModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/component-update-modal");
    }.property("model"),

    deleteModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/component-delete-modal");
    }.property("model"),

    keyValueListViews: ListValueGenerator.create()
        .add('Component ID', 'id')
        .add("Name", "name")
        .add("Manufacturer", "manufacturer")
        .add("Model name", "model_name")
        .add("Serial Number", "serial_number")
        .add("Kind", "json_kind.name")
        .add("State", "state")
        .add("Server", "json_server.name")
        .toProperty()
});

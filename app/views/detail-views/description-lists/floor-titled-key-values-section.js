import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

export default TitledKeyValuesSectionView.extend({
    title: "Floor information",
    editModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/floor-update-modal");
    }.property("model"),

    deleteModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/floor-delete-modal");
    }.property("model"),

    keyValueListViews: ListValueGenerator.create()
        .add('Floor ID', 'id')
        .add("Name", "name")
        .add("Node name", "node_name")
        .toProperty()
});

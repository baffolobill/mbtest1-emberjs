import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

export default TitledKeyValuesSectionView.extend({
    title: "Node information",
    editModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/node-update-modal");
    }.property("model"),

    deleteModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/node-delete-modal");
    }.property("model"),

    keyValueListViews: ListValueGenerator.create()
        .add("Name", "name")
        .add("Address", "address")
        .toProperty()
});

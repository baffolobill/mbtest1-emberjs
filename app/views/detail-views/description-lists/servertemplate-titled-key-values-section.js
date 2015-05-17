import TitledKeyValuesSectionView from "./titled-key-values-section";
import ListValueGenerator from "./list-value-generator";

export default TitledKeyValuesSectionView.extend({
    title: "Server Template information",
    editModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/servertemplate-update-modal");
    }.property("model"),

    deleteModelModalClass: function() {
        return this.get("container").lookupFactory("view:modals/servertemplate-delete-modal");
    }.property("model"),

    keyValueListViews: ListValueGenerator.create()
        .add('Server Template ID', 'id')
        .add("Name", "name")
        .add("Num servers uses", "servers_uses")
        .toProperty()
});

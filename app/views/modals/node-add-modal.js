import ModalBaseView from "./modal-base";
import Form from "./mixins/form-modal-mixin";
import Full from "./mixins/full-modal-mixin";
import Save from "./mixins/object-action-mixin";
import Node from "mb-test-1/models/node";

var AddNodeModal = ModalBaseView.extend(Full, Form, Save, {
    templateName: "modals/node-add-modal",
    elementId: "add-node",
    title: "Add a node",
    cancelButtonText: "Cancel",
    submitButtonText: "Add",
    successAlertText: "Your node was created successfully",

    model: function() {
        var node = Node.create({});
        return node;
    }.property(),

    onModelSaved: function(model) {
        //var Node = this.get("container").lookupFactory("model:node");
        //var controller = this.container.lookup("controller:marketplace");
        var controller = this.get('controller');
        //return Node.find(model.get("id")).then(function(m) {
            controller.transitionToRoute("node", model);
        //});
    },

    actions: {
        save: function() {
            this.save(this.get("model"));
        }
    }
});

AddNodeModal.reopenClass({
    open: function() {
        var view = this.create({});
        //var store = view.container.lookup('store:main');
        //var model = store.createRecord('node', {});
        //view.set('model', model);
        //Ember.Logger.debug(model);
        return view;
    },
});

export default AddNodeModal;

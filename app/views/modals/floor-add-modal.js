import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "./mixins/form-modal-mixin";
import Full from "./mixins/full-modal-mixin";
import Save from "./mixins/object-action-mixin";
import Floor from "mb-test-1/models/floor";
import Node from "mb-test-1/models/node";

var FloorAddModal = ModalBaseView.extend(Full, Form, Save, {
    templateName: "modals/floor-add-modal",
    elementId: "add-floor",
    title: "Add a floor",
    cancelButtonText: "Cancel",
    submitButtonText: "Add",
    successAlertText: "Your floor was created successfully",

    nodes: function() {
        return Node.findAll();
    }.property(),

    nodesForSelect: Ember.computed.map('nodes', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    model: function() {
        return Floor.create();
    }.property(),

    onModelSaved: function(model) {
        var controller = this.get('controller');
        Ember.Logger.debug('FloorAddModal.onModelSaved: model=', model);
        controller.transitionToRoute("floor", model.__json.id);
    },

    actions: {
        save: function() {
            this.save(this.get("model"));
        }
    }
});

FloorAddModal.reopenClass({
    open: function() {
        return this.create();
    },
});

export default FloorAddModal;

import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "mb-test-1/views/modals/mixins/form-modal-mixin";
import Full from "mb-test-1/views/modals/mixins/full-modal-mixin";
import Save from "mb-test-1/views/modals/mixins/object-action-mixin";
import Utils from "mb-test-1/lib/utils";
import Floor from "mb-test-1/models/floor";
import Node from "mb-test-1/models/node";

var FloorUpdateModalView = ModalBaseView.extend(Full, Form, Save, {
    templateName: 'modals/floor-update-modal',
    elementId: "floor-update",
    title: function() {
        return "Edit floor information";
    }.property(),

    cancelButtonText: "Cancel",
    submitButtonText: "Save",

    nodes: function() {
        return Node.findAll();
    }.property(),

    nodesForSelect: Ember.computed.map('nodes', function(o) {
        return {label: o.get('name'), value: o.get('id')+""};
    }),

    preselect: function() {
        var node_id = this.get('model').__json.node.id;
        this.set('selectedNode', node_id);
    }.observes('nodes.@each'),

    onModelSaved: function() {
        this.getNotificationController().alertSuccess('Floor has been saved.', {
            expire: true
        });
        this.get("originalModel").reload();
        this.close();
    },

    actions: {
        save: function() {
            this.save(this.get('model'));
        }
    }
});

FloorUpdateModalView.reopenClass({
    open: function(model) {
        var view = this.create({
            originalModel: model,
            model: model,
            selectedNode: null
        });
        return view;
    }
});

export default FloorUpdateModalView;

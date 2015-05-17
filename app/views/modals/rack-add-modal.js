import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "./mixins/form-modal-mixin";
import Full from "./mixins/full-modal-mixin";
import Save from "./mixins/object-action-mixin";
import Row from "mb-test-1/models/row";
import Rack from "mb-test-1/models/rack";

var RackAddModal = ModalBaseView.extend(Full, Form, Save, {
    templateName: "modals/rack-add-modal",
    elementId: "add-rack",
    title: "Add a rack",
    cancelButtonText: "Cancel",
    submitButtonText: "Add",
    successAlertText: "Your rack was created successfully",

    rows: function() {
        return Row.findAll();
    }.property(),

    rowsForSelect: Ember.computed.map('rows', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    preselect: function() {
        var row_id = this.get('rowsForSelect.firstObject').value;
        this.set('selectedRow', row_id);
    }.observes('rowsForSelect.@each'),

    model: function() {
        return Rack.create();
    }.property(),

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute("rack", model.__json.id);
    },

    actions: {
        save: function() {
            this.save(this.get("model"));
        }
    }
});

RackAddModal.reopenClass({
    open: function() {
        return this.create({
            selectedRow: null
        });
    },
});

export default RackAddModal;

import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "mb-test-1/views/modals/mixins/form-modal-mixin";
import Full from "mb-test-1/views/modals/mixins/full-modal-mixin";
import Save from "mb-test-1/views/modals/mixins/object-action-mixin";
import Utils from "mb-test-1/lib/utils";
import Row from "mb-test-1/models/row";
import Rack from "mb-test-1/models/rack";

var RackUpdateModalView = ModalBaseView.extend(Full, Form, Save, {
    templateName: 'modals/rack-update-modal',
    elementId: "rack-update",
    title: function() {
        return "Edit rack information";
    }.property(),

    cancelButtonText: "Cancel",
    submitButtonText: "Save",

    rows: function() {
        return Row.findAll();
    }.property(),

    rowsForSelect: Ember.computed.map('rows', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    preselect: function() {
        var row_id = this.get('model').__json.row.id;
        this.set('selectedRow', row_id);
    }.observes('rows.@each'),

    onModelSaved: function() {
        this.getNotificationController().alertSuccess('Rack has been saved.', {
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

RackUpdateModalView.reopenClass({
    open: function(model) {
        var view = this.create({
            originalModel: model,
            model: model,
            selectedRow: model.json_row.id
        });
        return view;
    }
});

export default RackUpdateModalView;

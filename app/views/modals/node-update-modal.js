import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "mb-test-1/views/modals/mixins/form-modal-mixin";
import Full from "mb-test-1/views/modals/mixins/full-modal-mixin";
import Save from "mb-test-1/views/modals/mixins/object-action-mixin";
import Utils from "mb-test-1/lib/utils";

var EditNodeDetailModalView = ModalBaseView.extend(Full, Form, Save, {
    templateName: 'modals/node-update-modal',
    elementId: "edit-node-detail",
    title: function() {
        return "Edit node information";
    }.property(),

    cancelButtonText: "Cancel",
    submitButtonText: "Save",

    onModelSaved: function() {
        this.getNotificationController().alertSuccess('Node has been saved.', {
            expire: true
        });
        this.get("originalModel").reload();
        this.close();
    },

    actions: {
        save: function() {
            this.save(this.get("model"));
        }
    }
});

EditNodeDetailModalView.reopenClass({
    open: function(model) {
        var view = this.create({
            originalModel: model
        });
        view.set("model", model);
        /*
        view.container.lookup("controller:marketplace")
            .get("store")
            .fetchItem("customer", model.get("href"))
            .then(function(customer) {
                view.set("model", customer);
            });
        */
        /*view.container.lookup("store:main")
            .fetchItem("node", model.get('id'))
            .then(function(node) {
                view.set("model", node);
            });*/
        return view;
    }
});

export default EditNodeDetailModalView;

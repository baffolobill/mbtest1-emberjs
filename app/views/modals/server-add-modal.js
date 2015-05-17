import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "./mixins/form-modal-mixin";
import Full from "./mixins/full-modal-mixin";
import Save from "./mixins/object-action-mixin";
import ServerTemplate from "mb-test-1/models/servertemplate";
import Server from "mb-test-1/models/server";

var ServerAddModal = ModalBaseView.extend(Full, Form, Save, {
    templateName: "modals/server-add-modal",
    elementId: "server-add",
    title: "Add a server",
    cancelButtonText: "Cancel",
    submitButtonText: "Add",
    successAlertText: "Your server was created successfully",

    templates: function() {
        return ServerTemplate.findAll();
    }.property(),

    templatesForSelect: Ember.computed.map('templates', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    preselect: function() {
        var template_id = this.get('templatesForSelect.firstObject').value;
        this.set('selectedTemplate', template_id);
    }.observes('templatesForSelect.@each'),

    model: function() {
        return Server.create();
    }.property(),

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute("server", model.__json.id);
    },

    actions: {
        save: function() {
            this.save(this.get("model"));
        }
    }
});

ServerAddModal.reopenClass({
    open: function() {
        return this.create({
            selectedTemplate: null
        });
    },
});

export default ServerAddModal;

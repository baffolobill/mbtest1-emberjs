import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "mb-test-1/views/modals/mixins/form-modal-mixin";
import Full from "mb-test-1/views/modals/mixins/full-modal-mixin";
import Save from "mb-test-1/views/modals/mixins/object-action-mixin";
import Utils from "mb-test-1/lib/utils";
import ServerTemplate from "mb-test-1/models/servertemplate";

var ServerUpdateModalView = ModalBaseView.extend(Full, Form, Save, {
    templateName: 'modals/server-update-modal',
    elementId: "server-update",
    title: function() {
        return "Edit server information";
    }.property(),

    cancelButtonText: "Cancel",
    submitButtonText: "Save",

    templates: function() {
        return ServerTemplate.findAll();
    }.property(),

    templatesForSelect: Ember.computed.map('templates', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    preselect: function() {
        var template = this.get('model').__json.template;
        this.set('selectedTemplate', template && template.id || null);
    }.observes('templates.@each'),

    onModelSaved: function() {
        this.getNotificationController().alertSuccess('Server has been saved.', {
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

ServerUpdateModalView.reopenClass({
    open: function(model) {
        var view = this.create({
            originalModel: model,
            model: model,
            selectedTemplate: model.__json.template && model.__json.template.id || null
        });
        return view;
    }
});

export default ServerUpdateModalView;

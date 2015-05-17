import ModalBaseView from "./modal-base";
import DeleteMixin from "./mixins/object-action-mixin";

var ServerTemplateDeleteModalView = ModalBaseView.extend(DeleteMixin, {
    templateName: "modals/servertemplate-delete-modal",
    elementId: "delete-servertemplate",
    classNames: ["wide-modal"],
    title: "Remove server template?",
    isSaving: false,

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute('servertemplates');
    },

    actions: {
        save: function(model) {
            this.delete(model);
        }
    }
});

ServerTemplateDeleteModalView.reopenClass({
    open: function(model) {
        return this.create({
            model: model
        });
    }
});

export default ServerTemplateDeleteModalView;

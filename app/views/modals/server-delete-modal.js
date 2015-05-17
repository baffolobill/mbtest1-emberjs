import ModalBaseView from "./modal-base";
import DeleteMixin from "./mixins/object-action-mixin";

var ServerDeleteModalView = ModalBaseView.extend(DeleteMixin, {
    templateName: "modals/server-delete-modal",
    elementId: "delete-server",
    classNames: ["wide-modal"],
    title: "Remove server?",
    isSaving: false,

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute('servers');
    },

    actions: {
        save: function(model) {
            this.delete(model);
        }
    }
});

ServerDeleteModalView.reopenClass({
    open: function(model) {
        return this.create({
            model: model
        });
    }
});

export default ServerDeleteModalView;

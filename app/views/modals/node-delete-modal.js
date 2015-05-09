import ModalBaseView from "./modal-base";
import DeleteMixin from "./mixins/object-action-mixin";

var NodeDeleteModalView = ModalBaseView.extend(DeleteMixin, {
    templateName: "modals/node-delete-modal",
    elementId: "delete-node",
    classNames: ["wide-modal"],
    title: "Remove node?",
    isSaving: false,

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute('nodes');
    },

    actions: {
        save: function(model) {
            this.delete(model);
        }
    }
});

NodeDeleteModalView.reopenClass({
    open: function(model) {
        var modal = this.create();
        modal.set('model', model);
        return modal;
    }
});

export default NodeDeleteModalView;

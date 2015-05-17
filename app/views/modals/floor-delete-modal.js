import ModalBaseView from "./modal-base";
import DeleteMixin from "./mixins/object-action-mixin";

var FloorDeleteModalView = ModalBaseView.extend(DeleteMixin, {
    templateName: "modals/floor-delete-modal",
    elementId: "delete-floor",
    classNames: ["wide-modal"],
    title: "Remove floor?",
    isSaving: false,

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute('floors');
    },

    actions: {
        save: function(model) {
            this.delete(model);
        }
    }
});

FloorDeleteModalView.reopenClass({
    open: function(model) {
        return this.create({
            model: model
        });
    }
});

export default FloorDeleteModalView;

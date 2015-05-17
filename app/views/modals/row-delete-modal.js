import ModalBaseView from "./modal-base";
import DeleteMixin from "./mixins/object-action-mixin";

var RowDeleteModalView = ModalBaseView.extend(DeleteMixin, {
    templateName: "modals/row-delete-modal",
    elementId: "delete-row",
    classNames: ["wide-modal"],
    title: "Remove row?",
    isSaving: false,

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute('rows');
    },

    actions: {
        save: function(model) {
            this.delete(model);
        }
    }
});

RowDeleteModalView.reopenClass({
    open: function(model) {
        return this.create({
            model: model
        });
    }
});

export default RowDeleteModalView;

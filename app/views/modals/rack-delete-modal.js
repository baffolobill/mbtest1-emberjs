import ModalBaseView from "./modal-base";
import DeleteMixin from "./mixins/object-action-mixin";

var RackDeleteModalView = ModalBaseView.extend(DeleteMixin, {
    templateName: "modals/rack-delete-modal",
    elementId: "delete-rack",
    classNames: ["wide-modal"],
    title: "Remove rack?",
    isSaving: false,

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute('racks');
    },

    actions: {
        save: function(model) {
            this.delete(model);
        }
    }
});

RackDeleteModalView.reopenClass({
    open: function(model) {
        return this.create({
            model: model
        });
    }
});

export default RackDeleteModalView;

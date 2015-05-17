import ModalBaseView from "./modal-base";
import DeleteMixin from "./mixins/object-action-mixin";

var BasketDeleteModalView = ModalBaseView.extend(DeleteMixin, {
    templateName: "modals/basket-delete-modal",
    elementId: "delete-basket",
    classNames: ["wide-modal"],
    title: "Remove basket?",
    isSaving: false,

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute('baskets');
    },

    actions: {
        save: function(model) {
            this.delete(model);
        }
    }
});

BasketDeleteModalView.reopenClass({
    open: function(model) {
        return this.create({
            model: model
        });
    }
});

export default BasketDeleteModalView;

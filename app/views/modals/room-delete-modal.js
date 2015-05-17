import ModalBaseView from "./modal-base";
import DeleteMixin from "./mixins/object-action-mixin";

var RoomDeleteModalView = ModalBaseView.extend(DeleteMixin, {
    templateName: "modals/room-delete-modal",
    elementId: "delete-room",
    classNames: ["wide-modal"],
    title: "Remove room?",
    isSaving: false,

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute('rooms');
    },

    actions: {
        save: function(model) {
            this.delete(model);
        }
    }
});

RoomDeleteModalView.reopenClass({
    open: function(model) {
        return this.create({
            model: model
        });
    }
});

export default RoomDeleteModalView;

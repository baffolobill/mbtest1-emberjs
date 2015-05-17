import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "./mixins/form-modal-mixin";
import Full from "./mixins/full-modal-mixin";
import Save from "./mixins/object-action-mixin";
import Floor from "mb-test-1/models/floor";
import Room from "mb-test-1/models/room";

var RoomAddModal = ModalBaseView.extend(Full, Form, Save, {
    templateName: "modals/room-add-modal",
    elementId: "add-room",
    title: "Add a room",
    cancelButtonText: "Cancel",
    submitButtonText: "Add",
    successAlertText: "Your room was created successfully",

    floors: function() {
        return Floor.findAll();
    }.property(),

    floorsForSelect: Ember.computed.map('floors', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    model: function() {
        return Room.create();
    }.property(),

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute("room", model.__json.id);
    },

    actions: {
        save: function() {
            this.save(this.get("model"));
        }
    }
});

RoomAddModal.reopenClass({
    open: function() {
        return this.create();
    },
});

export default RoomAddModal;

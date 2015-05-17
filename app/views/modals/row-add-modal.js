import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "./mixins/form-modal-mixin";
import Full from "./mixins/full-modal-mixin";
import Save from "./mixins/object-action-mixin";
import Row from "mb-test-1/models/row";
import Room from "mb-test-1/models/room";

var RowAddModal = ModalBaseView.extend(Full, Form, Save, {
    templateName: "modals/row-add-modal",
    elementId: "add-row",
    title: "Add a row",
    cancelButtonText: "Cancel",
    submitButtonText: "Add",
    successAlertText: "Your row was created successfully",

    rooms: function() {
        return Room.findAll();
    }.property(),

    roomsForSelect: Ember.computed.map('rooms', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    preselect: function() {
        var room_id = this.get('roomsForSelect.firstObject').value;
        Ember.Logger.debug('RowAddModal.preselect: room_id=', room_id);
        this.set('selectedRoom', room_id);
    }.observes('roomsForSelect.@each'),

    model: function() {
        return Row.create();
    }.property(),

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute("row", model.__json.id);
    },

    actions: {
        save: function() {
            this.save(this.get("model"));
        }
    }
});

RowAddModal.reopenClass({
    open: function() {
        return this.create({
            selectedRoom: null
        });
    },
});

export default RowAddModal;

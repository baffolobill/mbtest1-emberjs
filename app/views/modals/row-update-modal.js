import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "mb-test-1/views/modals/mixins/form-modal-mixin";
import Full from "mb-test-1/views/modals/mixins/full-modal-mixin";
import Save from "mb-test-1/views/modals/mixins/object-action-mixin";
import Utils from "mb-test-1/lib/utils";
import Row from "mb-test-1/models/row";
import Room from "mb-test-1/models/room";

var RowUpdateModalView = ModalBaseView.extend(Full, Form, Save, {
    templateName: 'modals/row-update-modal',
    elementId: "row-update",
    title: function() {
        return "Edit row information";
    }.property(),

    cancelButtonText: "Cancel",
    submitButtonText: "Save",

    rooms: function() {
        return Room.findAll();
    }.property(),

    roomsForSelect: Ember.computed.map('rooms', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    preselect: function() {
        var room_id = this.get('model').__json.room.id;
        this.set('selectedRoom', room_id);
    }.observes('rooms.@each'),

    onModelSaved: function() {
        this.getNotificationController().alertSuccess('Row has been saved.', {
            expire: true
        });
        this.get("originalModel").reload();
        this.close();
    },

    actions: {
        save: function() {
            this.save(this.get('model'));
        }
    }
});

RowUpdateModalView.reopenClass({
    open: function(model) {
        var view = this.create({
            originalModel: model,
            model: model,
            selectedRoom: model.json_room.id
        });
        return view;
    }
});

export default RowUpdateModalView;

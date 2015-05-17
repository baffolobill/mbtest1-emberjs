import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "mb-test-1/views/modals/mixins/form-modal-mixin";
import Full from "mb-test-1/views/modals/mixins/full-modal-mixin";
import Save from "mb-test-1/views/modals/mixins/object-action-mixin";
import Utils from "mb-test-1/lib/utils";
import Floor from "mb-test-1/models/floor";
import Room from "mb-test-1/models/room";

var RoomUpdateModalView = ModalBaseView.extend(Full, Form, Save, {
    templateName: 'modals/room-update-modal',
    elementId: "room-update",
    title: function() {
        return "Edit room information";
    }.property(),

    cancelButtonText: "Cancel",
    submitButtonText: "Save",

    floors: function() {
        return Floor.findAll();
    }.property(),

    floorsForSelect: Ember.computed.map('floors', function(o) {
        return {label: o.get('name'), value: o.get('id')+""};
    }),

    preselect: function() {
        var floor_id = this.get('model').__json.floor.id;
        this.set('selectedFloor', floor_id);
    }.observes('floors.@each'),

    onModelSaved: function() {
        this.getNotificationController().alertSuccess('Room has been saved.', {
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

RoomUpdateModalView.reopenClass({
    open: function(model) {
        var view = this.create({
            originalModel: model,
            model: model,
            selectedFloor: null
        });
        return view;
    }
});

export default RoomUpdateModalView;

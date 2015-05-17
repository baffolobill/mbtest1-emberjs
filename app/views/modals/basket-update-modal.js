import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "mb-test-1/views/modals/mixins/form-modal-mixin";
import Full from "mb-test-1/views/modals/mixins/full-modal-mixin";
import Save from "mb-test-1/views/modals/mixins/object-action-mixin";
import Utils from "mb-test-1/lib/utils";
import Basket from "mb-test-1/models/basket";
import Rack from "mb-test-1/models/rack";

var BasketUpdateModalView = ModalBaseView.extend(Full, Form, Save, {
    templateName: 'modals/basket-update-modal',
    elementId: "basket-update",
    title: function() {
        return "Edit basket information";
    }.property(),

    cancelButtonText: "Cancel",
    submitButtonText: "Save",

    racks: function() {
        return Rack.findAll();
    }.property(),

    racksForSelect: Ember.computed.map('racks', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    preselect: function() {
        var rack = this.get('model').__json.rack;
        this.set('selectedRack', rack && rack.id || null);
    }.observes('racks.@each'),

    onModelSaved: function() {
        this.getNotificationController().alertSuccess('Basket has been saved.', {
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

BasketUpdateModalView.reopenClass({
    open: function(model) {
        var view = this.create({
            originalModel: model,
            model: model,
            selectedRack: model.__json.rack && model.__json.rack.id || null
        });
        return view;
    }
});

export default BasketUpdateModalView;

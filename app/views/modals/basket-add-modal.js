import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "./mixins/form-modal-mixin";
import Full from "./mixins/full-modal-mixin";
import Save from "./mixins/object-action-mixin";
import Basket from "mb-test-1/models/basket";
import Rack from "mb-test-1/models/rack";

var BasketAddModal = ModalBaseView.extend(Full, Form, Save, {
    templateName: "modals/basket-add-modal",
    elementId: "add-basket",
    title: "Add a basket",
    cancelButtonText: "Cancel",
    submitButtonText: "Add",
    successAlertText: "Your basket was created successfully",

    racks: function() {
        return Rack.findAll();
    }.property(),

    racksForSelect: Ember.computed.map('racks', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    /*preselect: function() {
        var rack_id = this.get('racksForSelect.firstObject').value;
        this.set('selectedRack', rack_id);
    }.observes('racksForSelect.@each'),*/

    model: function() {
        return Basket.create();
    }.property(),

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute("basket", model.__json.id);
    },

    actions: {
        save: function() {
            this.save(this.get("model"));
        }
    }
});

BasketAddModal.reopenClass({
    open: function() {
        return this.create({
            selectedRack: null
        });
    },
});

export default BasketAddModal;

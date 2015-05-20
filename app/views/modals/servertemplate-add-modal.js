import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "./mixins/form-modal-mixin";
import Full from "./mixins/full-modal-mixin";
import Save from "./mixins/object-action-mixin";
import ServerTemplate from "mb-test-1/models/servertemplate";
import Property from "mb-test-1/models/property";
import PropertyOption from "mb-test-1/models/propertyoption";


var ServerTemplateAddModal = ModalBaseView.extend(Full, Form, Save, {
    templateName: "modals/servertemplate-add-modal",
    elementId: "servertemplate-add",
    title: "Add a server template",
    cancelButtonText: "Cancel",
    submitButtonText: "Add",
    successAlertText: "Your server template was created successfully",

    // cpu socket
    cpuSockets: function() {
        var obj = PropertyOption.create();
        return obj.getCPUSockets();
    }.property(),

    cpuSocketsForSelect: Ember.computed.map('cpuSockets', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    preselectCPUSockets: function() {
        var o_id = this.get('cpuSocketsForSelect.firstObject').value;
        this.set('selectedCPUSocket', o_id);
    }.observes('cpuSocketsForSelect.@each'),

    // ram standard
    ramStandards: function() {
        var obj = PropertyOption.create();
        return obj.getRAMStandards();
    }.property(),

    ramStandardsForSelect: Ember.computed.map('ramStandards', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    preselectRAMStandards: function() {
        var o_id = this.get('ramStandardsForSelect.firstObject').value;
        this.set('selectedRAMStandard', o_id);
    }.observes('ramStandardsForSelect.@each'),

    // hdd form factor
    hddFormFactors: function() {
        var obj = PropertyOption.create();
        return obj.getHDDFormFactors();
    }.property(),

    hddFormFactorsForSelect: Ember.computed.map('hddFormFactors', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    preselectHDDFormFactors: function() {
        var o_id = this.get('hddFormFactorsForSelect.firstObject').value;
        this.set('selectedHDDFormFactor', o_id);
        this.get('model')['hdds'].forEach(function(hdd) {
            if (Ember.get(hdd, 'hdd_form_factor') === null) {
                Ember.set(hdd, 'hdd_form_factor', o_id);
            }
        });
    }.observes('hddFormFactorsForSelect.@each'),

    // hdd connection type
    hddConnectionTypes: function() {
        var obj = PropertyOption.create();
        return obj.getHDDConnectionType();
    }.property(),

    hddConnectionTypeForSelect: Ember.computed.map('hddConnectionTypes', function(o) {
        return {label: o.get('name'), value: o.get('id')};
    }),

    preselectHDDConnectionTypes: function() {
        var o_id = this.get('hddConnectionTypeForSelect.firstObject').value;
        Ember.Logger.debug('preselectHDDConnectionTypes: ', o_id);
        this.set('selectedHDDConnectionType', o_id);
        this.get('model')['hdds'].forEach(function(hdd) {
            if (Ember.get(hdd, 'hdd_connection_type') === null) {
                Ember.set(hdd, 'hdd_connection_type', o_id);
            }
        });
    }.observes('hddConnectionTypes.@each'),

    model: function() {
        return ServerTemplate.create({
            hdds: Ember.A(),
        });
    }.property(),

    onModelSaved: function(model) {
        var controller = this.get('controller');
        controller.transitionToRoute("servertemplate", model.__json.id);
    },

    actions: {
        save: function() {
            this.save(this.get("model"));
        },
        addHdd: function() {
            var obj = Ember.Object.create({
                hdd_qty: 1,
                hdd_connection_type: null,
                hdd_form_factor: null
            });
            this.get('model')['hdds'].pushObject(obj);
        }
    },
});

ServerTemplateAddModal.reopenClass({
    open: function() {
        return this.create({
            selectedCPUSocket: null,
            selectedRAMStandard: null,
            selectedHDDFormFactor: null,
            selectedHDDConnectionType: null
        });
    },
});

export default ServerTemplateAddModal;

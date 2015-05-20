import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "mb-test-1/views/modals/mixins/form-modal-mixin";
import Full from "mb-test-1/views/modals/mixins/full-modal-mixin";
import Save from "mb-test-1/views/modals/mixins/object-action-mixin";
import Utils from "mb-test-1/lib/utils";
import ServerTemplate from "mb-test-1/models/servertemplate";
import Property from "mb-test-1/models/property";
import PropertyOption from "mb-test-1/models/propertyoption";

var ServerTemplateUpdateModalView = ModalBaseView.extend(Full, Form, Save, {
    templateName: 'modals/servertemplate-update-modal',
    elementId: "servertemplate-update",
    title: function() {
        return "Edit server template information";
    }.property(),

    cancelButtonText: "Cancel",
    submitButtonText: "Save",

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
        var current = this.get('model').__json.cpu_socket;
        this.set('selectedCPUSocket', current && current.id || o_id);
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
        var current = this.get('model').__json.ram_standard;
        this.set('selectedRAMStandard', current && current.id || o_id);
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
        var model = this.get('model');
        model['hdds'].forEach(function(hdd) {
            model.__json.hdds.forEach(function(json_hdd){
                if (hdd.id == json_hdd.id) {
                    var current = json_hdd.hdd_form_factor;
                    Ember.set(hdd, 'hdd_form_factor', current && current.id || o_id);
                }
            });
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
        var model = this.get('model');
        //Ember.Logger.debug('preselectHDDConnectionTypes:', model.__json.hdds);
        model['hdds'].forEach(function(hdd) {
            model.__json.hdds.forEach(function(json_hdd){
                if (hdd.id == json_hdd.id) {
                    var current = json_hdd.hdd_connection_type;
                    Ember.set(hdd, 'hdd_connection_type', current && current.id || o_id);
                }
            });
            //Ember.Logger.debug('preselectHDDConnectionTypes:', hdd);
            //Ember.set(hdd, 'hdd_connection_type', Ember.get(hdd, 'hdd_connection_type'));
        });
        //Ember.Logger.debug('model.hdds', model.hdds);
    }.observes('hddConnectionTypes.@each'),

    onModelSaved: function() {
        this.getNotificationController().alertSuccess('Server template has been saved.', {
            expire: true
        });
        this.get("originalModel").reload();
        this.close();
    },

    actions: {
        save: function() {
            this.save(this.get('model'));
        },
        addHdd: function() {
            var obj = Ember.Object.create({
                hdd_qty: 1,
                hdd_connection_type: null,
                hdd_form_factor: null
            });
            this.get('model')['hdds'].pushObject(obj);
        }
    }
});

ServerTemplateUpdateModalView.reopenClass({
    open: function(model) {
        var view = this.create({
            originalModel: model,
            model: model,
            //selectedTemplate: model.__json.template && model.__json.template.id || null
            selectedCPUSocket: model.__json.cpu_socket && model.__json.cpu_socket.id || null,
            selectedRAMStandard: model.__json.ram_standard && model.__json.ram_standard.id || null
        });
        return view;
    }
});

export default ServerTemplateUpdateModalView;

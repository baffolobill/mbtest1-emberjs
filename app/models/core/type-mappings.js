import Ember from "ember";

var TypeMapping = Ember.Object.extend({
    init: function(){
        this.typesMap = {};
    },

    addTypeMapping: function(typeCode, className) {
        this.typesMap[typeCode] = className;
    },

    classForType: function(typeCode) {
        var mappedType = this.typesMap[typeCode];
        if (!mappedType) {
            Ember.Logger.warn("Couldn't map typeCode %@".fmt(typeCode));
        }
        return this.typeClass(mappedType);
    },

    typeClass: function(type) {
        if (_.isString(type)) {
            return this.classForType(type);
        }
        else {
            return type;
        }
    }
});

var TypeMappings = TypeMapping.create();
export default TypeMappings;

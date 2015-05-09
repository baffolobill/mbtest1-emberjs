var ListValueGenerator;

ListValueGenerator = (function() {
  ListValueGenerator.create = function() {
    return new this;
  };

  function ListValueGenerator() {
    this.values = [];
  }

  ListValueGenerator.prototype.add = function(label, fieldName, hrefField) {
    this.values.push({
      label: label,
      fieldName: fieldName,
      hrefField: hrefField
    });
    return this;
  };

  ListValueGenerator.prototype.toProperty = function() {
    var fieldNames, method, values;
    values = this.values;
    fieldNames = values.mapBy("fieldName").map(function(name) {
      return "model." + name;
    });
    fieldNames.push("model");
    method = Ember.computed(function() {
      return values.map((function(_this) {
        return function(value) {
          if (Ember.isBlank(value.hrefField)) {
            return _this.getKeyValueView(value.label, value.fieldName);
          } else {
            return _this.getLinkedKeyValueView(value.label, value.fieldName, value.hrefField);
          }
        };
      })(this));
    });
    return method.property.apply(method, fieldNames);
  };

  return ListValueGenerator;

})();

export default ListValueGenerator;

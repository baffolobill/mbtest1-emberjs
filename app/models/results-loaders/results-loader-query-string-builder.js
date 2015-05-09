import Ember from "ember";


var isSerializableDate = function(value) {
  return _.isDate(value) || moment.isMoment(value);
};

export default Ember.Object.extend({
  queryStringAttributes: {},

  addValues: function(object) {
    var self =  this;
    _.each(object, function(value, key) {
        self.addValue(key, value);
    });
  },

  addValue: function(key, value) {
    if (Ember.isArray(value)) {
      if (value.length === 1) {
        return this.queryStringAttributes[key] = value[0];
      } else if (value.length > 1) {
        return this.queryStringAttributes[key + "[in]"] = value.join(",");
      }
    } else if (isSerializableDate(value)) {
      return this.queryStringAttributes[key] = value.toISOString();
    } else if (!Ember.isBlank(value)) {
      return this.queryStringAttributes[key] = value;
    }
  },

  getQueryStringAttributes: function() {
    return this.queryStringAttributes;
  }

});

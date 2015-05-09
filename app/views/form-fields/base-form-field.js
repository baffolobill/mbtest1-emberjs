import Ember from "ember";

export default Ember.View.extend({
  layoutName: "form-fields/form-field-layout",
  templateName: "form-fields/base-form-field",
  classNameBindings: [":form-group", "isError:has-error"],
  inputName: Ember.computed("field", function() {
    return this.get("field").replace(/\./, "_");
  }),
  value: Ember.computed("model", "field", function(a, value) {
    var field = this.get("field"),
      model = this.get("model");

    if (arguments.length > 1 && model) {
      model.set(field, value);
    }
    if (model) {
      return model.get(field);
    }
  }),
  displayAlertErrors: function() {
    $('.alert-error').hide();
    return this.$('.alert-error').css('display', 'inline');
  },
  didInsertElement: function() {
    var self = this,
      $el = this.$();

    var makeShowValidationErrors = function() {
      if (!(self.get('isDestroyed') || self.get('isDestroying'))) {
        self.set("isCanShowValidationErrors", true);
      }
    };

    $el.hover(function(event){
      self.displayAlertErrors();
    });
    $el.find(':input').focus(function(event){
      return self.displayAlertErrors();
    });
    $el.find(":input").blur(function(event) {
      return makeShowValidationErrors();
    });
    $el.closest("form").submit(function() {
      makeShowValidationErrors();
    });
  },
  isLegacyModel: Ember.computed.none("model.errors"),
  errorMessages: Ember.computed.reads("errorMessagesIndirectionHandler.messages"),
  isOneError: Ember.computed.equal("errorMessages.length", 1),
  errorMessagesIndirectionHandler: Ember.computed("isLegacyModel", "model", "field", function() {
    var errorsListKeyName,
      fieldName = this.get("field"),
      model = this.get("model");

    if (!this.get("isLegacyModel")) {
      errorsListKeyName = "model.errors." + fieldName;
    } else {
      errorsListKeyName = "model.validationErrors." + fieldName + ".messages";
    }
    return Ember.Object.extend({
      messages: Ember.computed.reads(errorsListKeyName)
    }).create({
      model: model
    });
  }),
  isCanShowValidationErrors: false,
  isError: Ember.computed("isCanShowValidationErrors", "isLegacyModel", "errorMessages.length", function() {
    var length = this.get("errorMessages.length");
    if (this.get("isLegacyModel")) {
      return length > 0;
    } else {
      return (length > 0) && this.get("isCanShowValidationErrors");
    }
  })
});

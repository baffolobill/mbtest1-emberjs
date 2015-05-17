import Ember from "ember";

var getRootErrorMessages = function(model) {
  var messages = model.get("errors._root") || model.get("validationErrors.messages");
  return Ember.A(messages);
};

export default Ember.Mixin.create({
  isSaving: false,
  onModelSaved: function(model) {
    this.close();
    return Ember.RSVP.resolve(model);
  },
  executeAction: function(callback) {
    var self = this;
    var notificationsController = this.getModalNotificationController();
    if (notificationsController) {
      notificationsController.clearAlerts();
    }
    var successHandler = function(model) {
      var successAlertText = self.get("successAlertText");
      if (!Ember.isBlank(successAlertText)) {
        self.getNotificationController().alertSuccess(successAlertText);
      }
      return self.onModelSaved(model);
    };
    var errorHandler = function(model) {
      if (!Ember.isBlank(model)) {
        var messages = getRootErrorMessages(model);
        messages.forEach(function(message) {
          return notificationsController.alertError(message);
        });
        return Ember.RSVP.reject(model);
      } else {
        return Ember.RSVP.reject();
      }
    };
    this.set("isSaving", true);
    return callback()
              .then(successHandler, errorHandler)
              .finally(function() {
                return self.set("isSaving", false);
              });
  },
  "delete": function(model) {
    return this.executeAction(function() {
      return model["delete"]();
    });
  },
  validateAndSaveModel: function() {
    var model = this.get("model");
    return this.executeAction(function() {
      return model.validateAndSave();
    });
  },
  save: function(model) {
    return this.executeAction(function() {
      if (model.get("validationErrors")) {
        model.get("validationErrors").clear();
      }
      return model.save();
    });
  }
});

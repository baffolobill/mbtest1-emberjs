import Ember from "ember";

export default Ember.Mixin.create({
  openNext: function() {
    var applicationController = this.get("container").lookup("controller:application");
    var args = _.toArray(arguments);
    args.unshift("openModal");
    return applicationController.send.apply(applicationController, args);
  },
  openInstance: function(instance) {
    return this.get("container").lookup("controller:modals-container").openInstance(instance);
  }
});

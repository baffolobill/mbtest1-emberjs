import Ember from "ember";

export default Ember.ContainerView.extend({
    didInsertElement: function() {
        this._super();
        this.get("controller").registerContainer(this);
    }
});

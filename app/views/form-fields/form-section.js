import Ember from "ember";

export default Ember.View.extend({
    classNameBindings: [":form-section", ":clearfix"],
    layoutName: "form-fields/form-section"
});

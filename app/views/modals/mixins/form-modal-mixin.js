import Ember from "ember";
import DisplayModelErrors from "./display-model-errors-modal-mixin";

export default Ember.Mixin.create(DisplayModelErrors, {
    layoutName: "modals/form-modal-layout"
});

import BaseFormFieldView from "./base-form-field";

export default BaseFormFieldView.extend({
    templateName: "form-fields/select-form-field",
    optionValuePath: "content.value",
    optionLabelPath: "content.label"
});

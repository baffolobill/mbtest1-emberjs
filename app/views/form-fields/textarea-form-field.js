import BaseFormFieldView from "./base-form-field";

export default BaseFormFieldView.extend({
    templateName: "form-fields/textarea-form-field",
    maxlength: 434,
    inputClassNames: "full",
    explanationText: function() {
        var maxLength = this.get('maxlength');

        if (maxLength > 0) {
            var noteLength = this.get('value') ? this.get('value.length') : 0;
            var remaining = maxLength - noteLength;
            return "%@ characters remaining".fmt(remaining);
        }
    }.property('value.length'),

});

import { fieldValidations } from './validations';


export default class FormValidator {

    fields = new Map();
    observers = [];

    registerField(name, validations, isRequired, value, callback) {
        validations = validations ? validations.split(',') : [];

        let isValid = this.checkValidField(value, isRequired, validations);

        this.fields.set(name, {
            validations: validations,
            isRequired: isRequired,
            isValid: isValid,
            value: value
        });

        callback(isValid);
        //this.formNotification(this.checkValidForm());
        this.notifyListeners();
    };

    checkValidField(value, isRequired, validations){


        // Check whether the new input passes all its validations:
        let isValid;

        if (isRequired){
            // If the field is required, if the field has validations run all validations:
            isValid = validations.length > 0 ?
                validations.every((validation) => {
                    return fieldValidations[validation](value)
                })
                // If the field has no validations, check if it has input:
                : value !== undefined && value.length > 0;

        } else {
            // if the field is not required, only run validations if there is input in the field:
            isValid = value.length > 0 ?
                validations.every((validation) => {
                    return fieldValidations[validation](value)
                }): true;
        }

        return isValid;
    }

    checkValidForm(){
        return Array.from(this.fields).every((item) => {
            return item[1].isValid;
        });
    };

    // Called every time an input changes value.
    updateField(fieldName, value, callback){

        // Get the current field:
        let field = this.fields.get(fieldName);

        let isValid = this.checkValidField(value, field.isRequired, field.validations);

        // Update the fields map with the new value and valid status:
        this.fields.set(fieldName, {
            validations: field.validations,
            isRequired: field.isRequired,
            isValid: isValid,
            value: value,
            callback: field.callback });

        // Notify the calling field and update the form.
        callback(isValid);
        //this.formNotification(this.checkValidForm());
        this.notifyListeners();
    }

    notifyListeners(){
        let isValid = this.checkValidForm();
        this.observers.forEach((observerCallback) => observerCallback(isValid));
    }


    addListener(callback){
        this.observers.push(callback);
    }

    removeListener(callback){
        this.observers = this.observers.filter((item) => item !== callback);
    }

    getData(){
        return new Map(Array.from(this.fields).filter((item) => item[1].isValid ));
    }
}
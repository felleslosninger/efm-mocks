import React from 'react';


let inputFunctions = {
  trim: function (value) {
      return value.replace(/ /g,'');
  }
};

export default class TextInput extends React.Component {

    constructor(props){
        super(props);
        this.state =  {
            isValid: false,
            isDirty: false,
            value: props.initialValue || '',
            isActive: false
        };
    }

    componentDidMount(){
        this.props.formValidator.registerField(
            this.props.name,
            this.props.validations,
            this.props.isRequired,
            this.state.value,
            this.fieldValidated
        );
    }

    fieldValidated = (isValid) => {
        this.setState({
            isValid : isValid
        });
    };

    onBlur = e => {
        this.setState({
            isActive: false
        }, () => {
            this.updateFormValidator();
        })
    };

    updateFormValidator(){
        this.props.formValidator.updateField(this.props.name, this.state.value, this.fieldValidated);
    }

    onChange = e => {

        // If we have an inputFunction prop, run it:
        let value = this.props.inputFunction ? inputFunctions[this.props.inputFunction](e.target.value) : e.target.value;

        this.setState({
            value: value,
            isDirty: true
        }, () => {
            this.updateFormValidator();
            if (this.props.onChange) this.props.onChange(value);
        });
    };


    onFocus = () => {
        this.refs[this.props.name].focus();
        this.setState({
            isActive: true
        });
    };

    render(){

        let className = '';

        if (this.props.disabled){
            className = 'disabled';
        } else if (this.state.isDirty) {

            if (this.state.isValid){
                className = 'valid';
            } else {
                className = this.props.isRequired ? 'error' : 'warning';
            }
        }

        let showErrorMessage = undefined;
        if (this.props.forceShowErrorMessage){
            showErrorMessage = !this.state.isValid;
        } else {
            showErrorMessage = !this.state.isValid && this.state.isDirty;
        }

        return (
            <div className="md-form" onClick={this.onFocus}>
                {this.props.label ?
                    <label className={this.state.isActive || this.state.value.length > 0 ? 'active' : ''} >{this.props.label}</label>
                    : null
                }
                <input
                    disabled={this.props.disabled}
                    type={this.props.type}
                    onFocus={this.onFocus}
                    value={this.state.value}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    className={`form-control ${className}`}
                    ref={this.props.name}
                    placeholder={this.props.placeholder}
                />

                { showErrorMessage &&
                    <div className={`invalid-feedback ${!this.props.isRequired ? 'warning' : ''}`}>
                        { this.props.errorMessage }
                    </div>
                }
            </div>
        );
    }
}
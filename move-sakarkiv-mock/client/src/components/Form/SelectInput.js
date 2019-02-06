import React from 'react';
//import './SelectInput.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class SelectInput extends React.Component {

    state = {
        selectedOption: null
    };

    constructor(props){
        super(props);
        this.state =  {
            isValid: false,
            isDirty: false,
            value: props.initialValue || '',
            isActive: false
        };
    }

    fieldValidated = (isValid) => {
        this.setState({
            isValid : isValid
        });
    };

    componentDidMount(){
        this.props.formValidator.registerField(
            this.props.name,
            this.props.validations,
            this.props.isRequired,
            this.state.value,
            this.fieldValidated
        );
    }

    updateFormValidator(){
        this.props.formValidator.updateField(
            this.props.name,
            this.state.selectedOption,
            this.fieldValidated);
    }

    handleChange = (selectedOption) => {
            this.setState(
                {
                    selectedOption : selectedOption ? selectedOption.value : '',
                    isDirty: true
                }, () => {
                    this.updateFormValidator();
                    this.props.onSelect();
                }
            );
        };

    render(){

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
                <div className="SelectInput">
                    <Select
                        name="form-field-name"
                        value={this.state.selectedOption}
                        onChange={this.handleChange}
                        options={this.props.options}
                    />
                </div>
                { showErrorMessage &&
                <div className={`invalid-feedback ${!this.props.isRequired ? 'warning' : ''}`}>
                    { this.props.errorMessage }
                </div>
                }
            </div>
        );
    }
}
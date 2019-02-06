import React from 'react';
import './Form.css';

export default class Form extends React.Component {

    state = {
        isValid: false,
        isDirty: false
    };

    constructor(props){
        super(props);
        props.formValidator.addListener(this.setFormValid);
    }

    componentWillUnmount(){
        this.props.formValidator.removeListener(this.setFormValid);
    }

    setFormValid = (isValid) => {
        this.setState({
            isValid: isValid,
            isDirty: true
        });
    };

    onSubmit = (e) => {
        e.preventDefault();

        this.setState({
            isDirty: false
        }, () => {
            if (this.state.isValid){
                this.props.onSubmit();
            }
        });
    };

    render() {

        const formError = this.props.showFormError && !this.state.isDirty;

        return (
            <form className={`ValidationForm ${formError ? 'form-error' : ''} ${this.props.className || ''}`} onSubmit={this.onSubmit}>
                { this.props.children }

                { formError &&
                    <div>
                        { this.props.formErrorMessage }
                    </div>
                }

                { !this.props.hideSubmitButton &&
                    <fieldset>
                        <button type="submit" className={`btn btn-success ${!this.state.isValid ? 'disabled' : '' }`}>{ this.props.submitButtonText }</button>
                    </fieldset>
                }

            </form>
        );
    }
}
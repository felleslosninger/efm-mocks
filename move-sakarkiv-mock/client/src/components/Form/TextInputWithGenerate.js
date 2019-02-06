import React from 'react';
import TextInput from "./TextInput";
import  uuidv1 from 'uuid/v1';

export default class TextInputWithGenerate extends TextInput {

    generateConversationId = () => {

        this.setState({
            value: uuidv1(),
            isDirty: true
        }, () => {
            this.updateFormValidator();
        });
    };

    render() {

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

                <button type="button" className="btn btn-outline-secondary btn-sm cancel-button" onClick={this.generateConversationId}>Generer</button>

            </div>
        );
    }
}
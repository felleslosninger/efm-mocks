import React from 'react';
import FormValidator from "../../components/Form/FormValidator";
import Form from "../../components/Form/Form";
import TextInput from "../../components/Form/TextInput";
import {PrismCode} from "react-prism";
import moment from "moment/moment";
import  uuidv1 from 'uuid/v1';
import './NewNextMoveMessage.css';
import MDSpinner from "react-md-spinner";
import axios from "axios";
import swal from "@sweetalert/with-react";

const formValidator = new FormValidator();


export default class NewNextMoveMessage extends React.Component {
    
    state = {
        mode: 'DPO'
    };

    send = () => {
        this.setState({
            isSending: true
        }, () => {

            axios({
                url: '/api/send/nextmove',
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(
                    this.state.mode === 'DPO' ?
                        this.StandardBusinessDocument(this.state.sender, this.state.receiver, 'arkivmelding', 'arkivmelding', 'administrasjon')
                        :
                        this.dpeSbd(this.state.sender, this.state.receiver, "innsynskrav"),
                    null, 2)
            }).then((res) => {
                swal({
                    text: "Message sent OK.",
                    icon: 'success',
                    buttons: {
                        cancel: "Close",
                    },
                    content: (
                        <div>
                            { `Filter by ${ res.data } in outgoing messages to follow the status.` }
                        </div>
                    )
                });

                this.setState({
                    messageSentOK: true,
                    isSending: false
                }, () => {
                    this.props.dismiss();
                });
            }).catch((error) => {
                if (error.response) {
                    this.props.dismiss();
                    swal({
                        text: "Something went wrong when sending message.",
                        icon: 'error',
                        buttons: {
                            cancel: "Close",
                        },
                        content: (
                            <div>
                                {error.response.data}
                            </div>
                        )
                    });

                } else if (error.request) {
                    this.props.dismiss();
                    swal({
                        text: "Something went wrong when sending message.",
                        icon: 'error',
                        buttons: {
                            cancel: "Close",
                        }
                    });

                } else {
                    this.props.dismiss();
                    swal({
                        text: "Something went wrong when sending message.",
                        icon: 'error',
                        buttons: {
                            cancel: "Close",
                        },
                        content: (
                            <div>
                                {error.message}
                            </div>
                        )
                    });
                }
            });

        });
    };


    StandardBusinessDocument = (senderOrgNr, receiverOrgNr, meldingsType, forretningsMelding, prosess) => {
        return {
            "standardBusinessDocumentHeader": {
                "headerVersion": "1.0",
                "sender": [
                    {
                        "identifier": {
                            "value": `0192:${senderOrgNr}`,
                            "authority": "iso6523-actorid-upis"
                        },
                        "contactInformation": []
                    }
                ],
                "receiver": [
                    {
                        "identifier": {
                            "value": `0192:${receiverOrgNr}`,
                            "authority": "iso6523-actorid-upis"
                        },
                        "contactInformation": []
                    }
                ],
                "documentIdentification": {
                    "standard": `urn:no:difi:${meldingsType}:xsd::${forretningsMelding}`,
                    "typeVersion": "2.0",
                    "type": forretningsMelding,
                    "creationDateAndTime": new moment()
                },
                "businessScope": {
                    "scope": [
                        {
                            "type": "ConversationId",
                            "instanceIdentifier": uuidv1(),
                            "identifier": `urn:no:difi:profile:arkivmelding:${prosess}:ver1.0`,
                            "scopeInformation": [
                                {
                                    "expectedResponseDateTime": new moment().add(2, 'hours')
                                }
                            ]
                        }
                    ]
                }
            },
            "arkivmelding": {
                "sikkerhetsnivaa": 3
            }
        };
    };

    dpeSbd = (senderOrgNr, receiverOrgNr, meldingsType) => {
        return {
            "standardBusinessDocumentHeader": {
                "headerVersion": "1.0",
                "sender": [
                    {
                        "identifier": {
                            "value": `0192:${senderOrgNr}`,
                            "authority": "iso6523-actorid-upis"
                        },
                        "contactInformation": []
                    }
                ],
                "receiver": [
                    {
                        "identifier": {
                            "value": `0192:${receiverOrgNr}`,
                            "authority": "iso6523-actorid-upis"
                        },
                        "contactInformation": []
                    }
                ],
                "documentIdentification": {
                    "standard": `urn:no:difi:einnsyn:xsd::${meldingsType}`,
                    "typeVersion": "2.0",
                    "type": meldingsType,
                    "creationDateAndTime": new moment()
                },
                "businessScope": {
                    "scope": [
                        {
                            "type": "ConversationId",
                            "instanceIdentifier": uuidv1(),
                            "identifier": `urn:no:difi:profile:einnsyn:${meldingsType}:ver1.0`,
                            "scopeInformation": [
                                {
                                    "expectedResponseDateTime": new moment().add(20, 'hours')
                                }
                            ]
                        }
                    ]
                }
            },
            "innsynskrav": {
                "orgnr": receiverOrgNr,
                "epost": "test@example.com"
            }
        };
    };

    receiverChanged = (value) => {
        this.setState({
            receiver: value
        });
    };

    senderChanged = (value) => {
        this.setState({
            sender: value
        });
    };

    setMode = (mode) => {
        this.setState({
            mode: mode
        });
    };

    render(){
        return (
            <div className="NewNextMoveMessage">

                <h1>Send NextMove message</h1>

                <div className="container">

                <div className="md-form">
                    <label >Message type</label>

                    <div style={{ marginLeft: '10px' }}  className="btn-group btn-group-toggle" data-toggle="buttons">
                        <label className={`btn btn-outline-primary btn-sm ${this.state.mode === 'DPO' && 'active'}`}>
                            <input type="radio" name="options" id="option1" autoComplete="off" checked={this.state.mode === 'DPO'} onChange={() => this.setMode('DPO')} />Arkivmelding
                        </label>
                        <label className={`btn btn-outline-primary btn-sm ${this.state.mode === 'DPE' && 'active'}`}>
                            <input type="radio" name="options" id="option2" autoComplete="off" checked={this.state.mode === 'DPE'} onChange={() => this.setMode('DPE')} />eInnsynsmelding
                        </label>
                    </div>

                </div>

                    <Form formValidator={formValidator}
                          onSubmit={this.send}
                          submitButtonText={"Send"}
                          >

                        <TextInput
                            formValidator={formValidator}
                            name="sender"
                            validations="orgNum"
                            isRequired={true}
                            label="Sender *"
                            type="text"
                            errorMessage="Vennligst angi et gyldig org nummer."
                            initialValue={this.state.unconfirmedOrgNum  || null}
                            inputFunction='trim'
                            onChange={this.senderChanged}
                        />

                        <TextInput
                            formValidator={formValidator}
                            name="receiver"
                            validations="orgNum"
                            isRequired={true}
                            label="Receiver *"
                            type="text"
                            errorMessage="Vennligst angi et gyldig org nummer."
                            initialValue={this.state.unconfirmedOrgNum  || null}
                            inputFunction='trim'
                            onChange={this.receiverChanged}
                        />

                    </Form>



                </div>


                { this.state.isSending ?

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <MDSpinner
                            size={24}
                            color1="#498CBB"
                            color2="#8F6693"
                            color3="#5ACAFA"
                            color4="#C7B3CA"
                        />
                    </div>
                :
                    <PrismCode component="pre" className="language-json">
                        { `${JSON.stringify(
                            this.state.mode === 'DPO' ?
                                this.StandardBusinessDocument(this.state.sender, this.state.receiver, 'arkivmelding', 'arkivmelding', 'administrasjon')
                                :
                                this.dpeSbd(this.state.sender, this.state.receiver, "innsynskrav"),
                            null, 2)}`
                        }
                    </PrismCode>
                }

                <button className="btn btn-secondary right" onClick={this.props.dismiss}>Cancel</button>

            </div>
        );
    }
}
import React from 'react';
import Form from "../../../components/Form/Form";
import TextInput from "../../../components/Form/TextInput";
import FormValidator from "../../../components/Form/FormValidator";
import config from "../../../modules/config";
import envelope from "../../../messages/envelope";
import payload from "../../../messages/payload";
import MDSpinner from "react-md-spinner";
import 'prismjs';
import 'prismjs/themes/prism.css';
import {PrismCode} from "react-prism";
import moment from "moment";
import getFile from "../../../messages/file";
import TextInputWithGenerate from "../../../components/Form/TextInputWithGenerate";
import axios from 'axios';
import './MessageForm.css';
import  uuidv1 from 'uuid/v1';
import swal from '@sweetalert/with-react'

const formValidator = new FormValidator();
const formValidator2 = new FormValidator();



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIntOfSize(size){
    let returnArray = [...Array(size)].map(()=>{
        return getRandomInt(0, 9)
    });
    return parseInt(returnArray.join(''))
}

function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

if (!String.prototype.encodeHTML) {
    String.prototype.encodeHTML = function () {
        return this.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };
}

const jpJpostnr = getRandomIntOfSize(2);
const jpSeknr = getRandomIntOfSize(6);
const jpJdato = new moment().format('YYYY-MM-DD');
const jpJaar = 2019;
const jpId = getRandomIntOfSize(6);
const jpDokdato = new moment().format('YYYY-MM-DD');
const saSaar = 2019;
const saDato = new moment().format('YYYY-MM-DD');
const saSeknr = getRandomIntOfSize(5);
const saArkdel = 'EARKIV1';

export default class MessageForm extends React.Component {
    
    state = {
        // hasError: true,
        // isSending: false,
        // errorMessage: "The specified recipient does not support this message type. Please check that the org nubmer you are trying to send to has a record in the SR MOCK."
    };

    componentDidMount() {
        formValidator2.addListener(this.onFormUpdate)
    };

    componentWillUnmount() {
        formValidator2.removeListener(this.onFormUpdate)
    };

    onFormUpdate = isValid => {
        this.setState({
            formValid : isValid
        });
    };

    checkBRR = () => {

        this.setState({
            isCheckingBR: true
        }, () => {
            let orgNum = formValidator.getData().get('receiver').value;

            axios.get(`http://data.brreg.no/enhetsregisteret/enhet/${orgNum}.json`)
                .then((res) => {
                    this.setState({
                        isCheckingBR: false,
                        error: null,
                        selectedOrg: {
                            orgNum: res.data.organisasjonsnummer,
                            orgName: res.data.navn
                        }
                    });
                }).catch((err) => {




                    // this.setState({
                    //     isCheckingBR: false,
                    //     error: {
                    //         message: err.response.statusText
                    //     }
                    // });

                this.setState({
                    isCheckingBR: false,
                    error: null,
                    selectedOrg: {
                        orgNum: orgNum,
                        orgName: "Test Organisasjon"
                    }
                });

            });
        });
    };

    changeSender = () => {
        this.setState({
            showMessage: false,
            selectedOrg: null,
            unconfirmedOrgNum: this.state.selectedOrg.orgNum
        });
    };

    toggleShowMessage = () => {

        let shouldShow = !this.state.showMessage;
        let caseTitle, docTitle;
        if (shouldShow) {
            caseTitle = formValidator2.getData().get('caseTitle').value;
            docTitle = formValidator2.getData().get('docTitle').value;
        }

        this.setState({
            showMessage: shouldShow,
            caseTitle: caseTitle,
            docTitle: docTitle
        });
    };

    getPayload(file){
        let caseTitle = '';
        let docTitle = '';
        let jpInnhold = '';

        if (formValidator2.checkValidForm()){
            caseTitle = formValidator2.getData().get('caseTitle').value;
            docTitle = formValidator2.getData().get('docTitle').value;
            jpInnhold = formValidator2.getData().get('journalTitle').value;
        }

        return payload(
            jpId, jpJaar, jpSeknr,
            jpJpostnr, jpJdato, jpDokdato,
            this.state.selectedOrg.orgNum,
            this.state.selectedOrg.orgName,
            saSaar, saSeknr, saDato, saArkdel,
            docTitle, caseTitle, file, jpInnhold
        );
    }

    getEnvelope(payload){
        return envelope(
            config.orgNum,
            config.orgName,
            config.email,
            uuidv1(),
            this.state.selectedOrg.orgNum,
            this.state.selectedOrg.orgName,
            "ergkm@eaglkrg.no",
            uuidv1(),
            payload, formValidator2.getData().get('convId').value
        );
    }

    sendMessage = () => {
        let message = this.getEnvelope(this.getPayload(getFile()).encodeHTML());
        this.setState({
            isSending: true
        },() => {

            let body = {
                payload: message,
                sender: config.orgNum,
                receiver: this.state.selectedOrg.orgNum,
                conversationId: formValidator2.getData().get('convId').value
            };

            axios({
                url: `${window.baseName}/api/send`,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(body)
            }).then((res) => {
                console.log(res);

                this.props.dismiss();

                swal({
                    text: "Message sent OK.",
                    icon: 'success',
                    buttons: {
                        cancel: "Close",
                    },
                    content: (
                        <div>
                            { `Filter by ${ body.conversationId } in outgoing messages to follow the status.` }
                        </div>
                    )
                });

                this.setState({
                    messageSentOK: true,
                    isSending: false
                }, () => {
                    //this.props.dismiss();
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

    renderForm = () =>
        <div style={{
            height: "100%",
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
        <div style={{ maxHeight: "96%", overflow: 'scroll' }}>

            <div className="MessageForm container">



                <h3>Ny melding</h3>

                <div className="row wrapper">

                    <div className="col-lg-6">

                        <h4>Mottaker</h4>

                        {
                            !this.state.selectedOrg &&
                                <Form formValidator={formValidator}
                                      onSubmit={this.checkBRR}
                                      submitButtonText={"Sett mottaker"}
                                      disabled={this.state.isCheckingBR}>

                                    {
                                        !this.state.isCheckingBR &&
                                            <TextInput
                                                formValidator={formValidator}
                                                name="receiver"
                                                validations="orgNum"
                                                isRequired={true}
                                                label="Mottaker *"
                                                type="text"
                                                errorMessage="Vennligst angi et gyldig org nummer."
                                                initialValue={this.state.unconfirmedOrgNum  || null}
                                                inputFunction='trim'
                                            />
                                    }

                                    {
                                        this.state.isCheckingBR &&
                                            <MDSpinner
                                                size={24}
                                                color1="#498CBB"
                                                color2="#8F6693"
                                                color3="#5ACAFA"
                                                color4="#C7B3CA"
                                            />
                                    }
                                </Form>
                        }

                        {
                            this.state.selectedOrg &&
                                <div>
                                    <ul>
                                        <li>Orgnr: { this.state.selectedOrg.orgNum }</li>
                                        <li>Navn: { this.state.selectedOrg.orgName }</li>
                                    </ul>

                                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={this.changeSender}>Skift mottaker</button>


                                    <Form formValidator={formValidator2}
                                          onSubmit={this.sendMessage}
                                          submitButtonText={"Send"}
                                          hideSubmitButton={true}
                                    >

                                        <TextInputWithGenerate
                                            formValidator={formValidator2}
                                            name="convId"
                                            isRequired={true}
                                            label="ConversationId *"
                                            type="text"
                                            errorMessage="Vennligst angi ConversationId."
                                        />

                                        <TextInput
                                            formValidator={formValidator2}
                                            name="caseTitle"
                                            isRequired={true}
                                            label="Sakstittel *"
                                            type="text"
                                            errorMessage="Vennligst angi sakstittel."
                                        />

                                        <TextInput
                                            formValidator={formValidator2}
                                            name="journalTitle"
                                            isRequired={true}
                                            label="Journaltittel *"
                                            type="text"
                                            errorMessage="Vennligst angi journaltittel."
                                        />

                                        <TextInput
                                            formValidator={formValidator2}
                                            name="docTitle"
                                            isRequired={true}
                                            label="Dokumenttittel *"
                                            type="text"
                                            errorMessage="Vennligst angi dokumenttittel."
                                        />
                                    </Form>
                                </div>
                        }

                        { this.state.error &&
                            <div>{ this.state.error.message }</div>
                        }

                    </div>

                    <div className="col-lg-6">
                        <h4>Avsender</h4>
                        <ul>
                            <li>Orgnr: { config.orgNum }</li>
                            <li>Navn: { config.orgName }</li>
                        </ul>
                    </div>

                    {
                        this.state.showMessage &&
                            <div className="col-lg-12">
                                <h5>Envelope:</h5>
                                <PrismCode component="pre" className="language-markup">
                                    { this.getEnvelope() }
                                </PrismCode>
                                <h5>Payload:</h5>
                                <PrismCode component="pre" className="language-markup">
                                    { this.getPayload() }
                                </PrismCode>
                            </div>
                    }
                </div>
            </div>
        </div>
        <div className='form-buttons'>
            <div className='message-buttons'>
                <button type="button" className={`btn btn-outline-primary  ${ !this.state.formValid && 'disabled' }`} disabled={!this.state.formValid} onClick={this.sendMessage}>
                    {
                        this.state.isSending ?
                            <MDSpinner
                                size={24}
                                color1="#498CBB"
                                color2="#8F6693"
                                color3="#5ACAFA"
                                color4="#C7B3CA"
                            />
                            : 'Send'
                    }
                </button>
                <button type="button" className="btn btn-outline-primary" onClick={() => {
                    download('test.pdf', getFile())
                }}>Vis fil</button>
                <button type="button" className="btn btn-outline-primary" disabled={!this.state.formValid} onClick={this.toggleShowMessage}>{ this.state.showMessage ? 'Skjul melding' : 'Vis melding' }</button>
            </div>
            <button type="button" className="btn btn-outline-secondary btn-sm cancel-button" onClick={this.props.dismiss}>Avbryt</button>
        </div>
    </div>;


    render(){

        if (this.state.hasError) {
            return <MessageError errorMessage={this.state.errorMessage} />
        }

        let content = this.state.messageSentOK ? <div>Success!</div> : this.renderForm();

        return content;
    }
}


const MessageError = ({ errorMessage }) => {
  return (
    <div className={'Aligner'}>
        <div className="Aligner-item">
            <h5>{errorMessage}</h5>
        </div>
    </div>
  );
};


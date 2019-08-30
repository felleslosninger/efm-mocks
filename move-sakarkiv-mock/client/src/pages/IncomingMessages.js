import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import ReactModal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {PrismCode} from "react-prism";
import MDSpinner from "react-md-spinner";

const modalStyle = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 100000
    },
    content: {
        position: 'absolute',
        top: '40px',
        left: '40px',
        right: '40px',
        bottom: '40px',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto'
    }
};

export default class IncomingMessages extends React.Component {

    state = {
        showNewMessage: false,
        messages: []
    };

    poll = () => {
        axios.get(`${window.baseName}/api/messages`).then((res) => {
            let nextMessages = Array.from(new Map(res.data).values())
            if (nextMessages.length !== this.state.messages.length) {
                this.setState({
                    messages: nextMessages
                }, () => {
                    this.toastId = toast.success("New message received.", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 2000
                    });
                });
            }

        });
    };

    componentDidMount() {

        axios.get(`${window.baseName}/api/messages`).then((res) => {
            let db = new Map(res.data);
            this.setState({
                messages: Array.from(db.values())
            });
            this.timer = setInterval(()=> this.poll(), 5000);
        });
    }

    componentWillUnmount() {
        this.timer = null;
    }

    showPayload = (row) => {
        this.setState({
            showModal: true,
            modalConversationID: row.value,
            isNextMove: row.original.type === "nextMove"
        });
    };

    dismissModal = () => {
        this.setState({
            showModal: false
        });
    };

    render(){
        return (
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                <div
                    className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Incoming messages</h1>
                </div>

                <div className="table-responsive">

                    <ReactTable
                        data={this.state.messages}
                        columns={[
                            {
                                Header: "Receiver org number",
                                accessor: "receiver.orgnr",
                                filterable:true
                            },
                            {
                                Header: "Sender org number",
                                accessor: "sender.orgnr",
                                filterable:true
                            },
                            {
                                Header: "Conversation ID",
                                accessor: "conversationId",
                                filterable:true
                            },
                            {
                                Header: "Type",
                                accessor: "type",
                                filterable:false
                            },
                            {
                                Header: "Payload",
                                accessor: "conversationId",
                                Cell: (row) => {
                                    return <div>
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => this.showPayload(row)}>Raw message</button>
                                    </div>
                                }
                            }
                        ]}
                        defaultPageSize={10}
                        className=" -highlight"
                    />

                    <ToastContainer
                        position="top-right"
                        type="default"
                        hideProgressBar={true}
                        newestOnTop={false}
                        closeOnClick
                        pauseOnHover
                    />

                    <ReactModal
                        style={modalStyle}
                        isOpen={this.state.showModal}
                    >
                        <ModalBody
                            conversationID={this.state.modalConversationID}
                            dismiss={this.dismissModal}
                            isNextMove={this.state.isNextMove}
                        />
                    </ReactModal>
                </div>
            </main>
        );
    }
}



class ModalBody extends React.Component {

    state = {
        isLoading: true,
        payload: null
    };

    componentDidMount() {
        axios.get(`${window.baseName}/api/messages/payload/${this.props.conversationID}`)
            .then((res) => {

                this.setState({
                    isLoading: false,
                    payload: res.data.payload
                });

            }).catch((err) => {
                console.log(err);
            })
    }

    render(){
        return (
            <div className="modal-body">
                { this.state.isLoading &&
                        <MDSpinner
                            size={24}
                            color1="#498CBB"
                            color2="#8F6693"
                            color3="#5ACAFA"
                            color4="#C7B3CA"
                        />
                    }

                    <div>
                        { !this.state.isLoading &&
                            <PrismCode component="pre" className={this.props.isNextMove ? "language-json" : "language-markup"}>
                                { this.props.isNextMove ? JSON.stringify(JSON.parse(this.state.payload), null, 2) : this.state.payload }
                            </PrismCode>
                        }
                    </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={this.props.dismiss}>Close</button>
                </div>
            </div>
        );
    }
}
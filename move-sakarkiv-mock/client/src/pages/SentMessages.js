import React from 'react';
import ReactTable from "react-table";
import {toast, ToastContainer} from "react-toastify";
import "react-table/react-table.css";
import ReactModal from 'react-modal';
import MessageForm from "./NewMessage/NewMessageModal/MessageForm";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

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

export default class SentMessages extends React.Component {
    
    state = {
    };

    poll = () => {
        axios.get(`${window.baseName}/api/outgoing`).then((res) => {

            if (res.data.length !== this.state.messages.length) {
                this.setState({
                    messages: res.data
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
        this.timer = null;
        axios.get(`${window.baseName}/api/outgoing`).then((res) => {
            this.setState({
                messages: res.data
            });
            this.timer = setInterval(()=> this.poll(), 5000);
        });
    }

    componentWillUnmount() {
        this.timer = null;
    }

    processMessages = (messages) => {
        return messages.content.map(entry => {
            return {
                conversationId: entry.conversationId,
                senderIdentifier: entry.senderIdentifier,
                receiverIdentifier: entry.receiverIdentifier,
                messageReference: entry.messageReference,
                messageTitle: entry.messageTitle,
                lastUpdate: entry.lastUpdate,
                serviceIdentifier: entry.serviceIdentifier,
                statuses: entry.messageStatuses.map(status => status.status).join(', ')
            }
        })
    };

    render(){
        return (
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                <div
                    className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h2">Sent messages</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group mr-2">
                            {/*<button className="btn btn-sm btn-outline-secondary">Share</button>*/}
                            {/*<button className="btn btn-sm btn-outline-secondary" onClick={this.toggleNewMessage}>New message</button>*/}
                        </div>
                        {/*<button className="btn btn-sm btn-outline-secondary dropdown-toggle">*/}
                        {/*<span data-feather="calendar" />*/}
                        {/*This week*/}
                        {/*</button>*/}
                    </div>
                </div>
                <div className="table-responsive">

                    { this.state.messages &&
                        <ReactTable
                            data={this.processMessages(this.state.messages)}
                            columns={[
                                {
                                    Header: "Receiver org number",
                                    accessor: "receiverIdentifier",
                                    filterable:true
                                },
                                {
                                    Header: "Sender org number",
                                    accessor: "senderIdentifier",
                                    filterable:true
                                },
                                {
                                    Header: "Conversation ID",
                                    accessor: "conversationId",
                                    filterable:true
                                },
                                {
                                    Header: "Service Identifier",
                                    accessor: "serviceIdentifier"
                                },
                                {
                                    Header: "Statuses",
                                    accessor: "statuses"
                                }
                            ]}
                            defaultPageSize={10}
                            className=" -highlight"
                        />
                    }

                    <ReactModal
                        style={modalStyle}
                        isOpen={this.state.showNewMessage}
                        contentLabel="Minimal Modal Example"
                        onSave={this.showNewMessage}>
                        <MessageForm
                            dismiss={this.toggleNewMessage}
                        />
                    </ReactModal>

                    <ToastContainer
                        position="top-right"
                        type="default"
                        hideProgressBar={true}
                        newestOnTop={false}
                        closeOnClick
                        pauseOnHover
                    />

                </div>
            </main>
        );
    }
}
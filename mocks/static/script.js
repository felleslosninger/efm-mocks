
const deleteButtons = document.querySelectorAll('.delete-button');

let dpfMessageContainer = document.getElementById('dpf-messages');
let dpoMessageContainer = document.getElementById('dpo-messages');
let dpvMessageContainer = document.getElementById('dpv-messages');
let dpeMessageContainer = document.getElementById('dpe-messages');
let dpiMessageContainer = document.getElementById('dpi-messages');

let messageContainers = [
    {
        serviceIdentifier: 'dpi',
        element: dpiMessageContainer
    },
    {
        serviceIdentifier: 'dpf',
        element: dpfMessageContainer
    },
    {
        serviceIdentifier: 'dpo',
        element: dpoMessageContainer
    },
    {
        serviceIdentifier: 'dpv',
        element: dpvMessageContainer
    },
    {
        serviceIdentifier: 'dpe',
        element: dpeMessageContainer
    } ];

let emptyMessages = function(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

deleteButtons.forEach(button => {
    button.addEventListener('click', function(e){

        axios.post(`${window.location.href}api/messages/${button.dataset.serviceidentifier}`)
            .then(function(res){
                e.target.innerText = 'Delete';
                emptyMessages(button.dataset.serviceidentifier === 'DPO' ? dpoMessageContainer : dpfMessageContainer);
            })
            .catch(function(err){
                console.log("fail", err);
            });
    });
});

function messageTable(serviceIdentifier, messages, headers){
    return `${messages
        .map((entry) => {
            return entry ?
                `<tr>${headers.headers.map(header => `<td>${entry[header.accessor]}</td>`).join('')}</tr>` 
                : null
        }).join('')}`;
}

poll = () => {
    axios.get('/api/messages').then((res) => {
        console.log(res.data);
        messageContainers.forEach((targetElement) => emptyMessages(targetElement.element));

        res.data.forEach((data) => {
            let theHeaders = headers.filter((header) => header.serviceIdentifier === data.serviceIdentifier)[0];
            let containerElement = messageContainers.filter(container => container.serviceIdentifier === data.serviceIdentifier)[0];
            containerElement.element.innerHTML = messageTable(data.serviceIdentifier, data.messages, theHeaders);
            }
        )
    });
};
poll();
setInterval(poll, 5000);



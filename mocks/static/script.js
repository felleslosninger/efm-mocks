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

    console.log(headers);

    return `${messages
        .map((entry) => {
            console.log(entry);
            return entry ?
                `<tr>${headers.map(header => `<td>${entry[header.accessor]}</td>`).join('')}</tr>` 
                : null
        }).join('')}`;
}

poll = (url, serviceIdentifier, targetElement) => {
    axios.get(url).then((res) => {
        console.log(res.data);
        messageContainers.forEach((targetElement) => emptyMessages(targetElement.element));

        // headers.forEach(header => )
        res.data.forEach((data) => {
            console.log(data);
            console.log(headers);
            let theHeaders = headers.filter((header) => header.serviceIdentifier === data.serviceIdentifier)[0];
            messageTable(data.serviceIdentifier, data.messages, theHeaders);
            }
        )
    });
};

setInterval(poll('/api/messages'), 5000)



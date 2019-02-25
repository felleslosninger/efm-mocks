const deleteButtons = document.querySelectorAll('.delete-button');

let dpfMessageContainer = document.getElementById('DPF-messages');
let dpoMessageContainer = document.getElementById('DPO-messages');
let dpvMessageContainer = document.getElementById('DPV-messages');

let emptyMessages = function(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

deleteButtons.forEach(button => {
    button.addEventListener('click', function(e){

        axios.post(`${window.location.href}api/messages/${button.dataset.serviceidentifier}`)
            .then(function(res){
                e.target.innerText = 'Delete'
                emptyMessages(button.dataset.serviceidentifier === 'DPO' ? dpoMessageContainer : dpfMessageContainer);

            })
            .catch(function(err){
                console.log("fail", err);
            });
    });
});

function messageTable(serviceIdentifier, messages){
    return `${[...messages]
        .map(([key, value]) => {
            return key ? `<tr><td>${key.receiver}</td><td>${key.fileReference}</td><td>${key.receiptId}</td></tr>` : null
        }).join('')
        }`;
}

function messageTable2(serviceIdentifier, messages, headers){
    return `${messages
        .map((entry) => {
            return entry ? `<tr>
                                ${Object.values(entry).map((value) => `<td>${value}</td>    `).join('')}</tr>` : null
        }).join('')
        }`;
}


poll = (url, serviceIdentifier, targetElement) => {
    axios.get(url).then((res) => {
        emptyMessages(targetElement);
        targetElement.innerHTML = messageTable(serviceIdentifier, Array.from(new Map(res.data)));
    });
};


poll2 = (url, serviceIdentifier, targetElement, headers) => {
    axios.get(url).then((res) => {
        emptyMessages(targetElement);
        targetElement.innerHTML = messageTable2(serviceIdentifier, res.data, headers);
    });
};


axios.get('/api/messages/dpf').then((res) => {
    this.timer = setInterval(()=> this.poll('/api/messages/dpf', 'DPF', dpfMessageContainer), 5000);
});

setTimeout(() => {
    axios.get('/api/messages/dpo').then((res) => {
        this.timer = setInterval(()=> this.poll('/api/messages/dpo', 'DPO',  dpoMessageContainer), 5000);
    });
}, 1000)


setTimeout(() => {
    axios.get('/api/messages/dpv').then((res) => {
        this.timer = setInterval(()=> this.poll2('/api/messages/dpv', 'DPV',  dpvMessageContainer, dpvHeaders), 1000);
    });
}, 2000)




const deleteButtons = document.querySelectorAll('.delete-button');

let dpfMessageContainer = document.getElementById('DPF-messages');
let dpoMessageContainer = document.getElementById('DPO-messages');

let emptyMessages = function(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

deleteButtons.forEach(button => {
    button.addEventListener('click', function(e){

        axios.post(`${window.location.href}api/messages/${button.dataset.serviceidentifier}`)
            .then(function(res){
                // console.log("success", res);
                e.target.innerText = 'Delete'
                emptyMessages(button.dataset.serviceidentifier === 'DPO' ? dpoMessageContainer : dpfMessageContainer);

            })
            .catch(function(err){
                console.log("fail", err);
            });
    });
});

function messageTable(serviceIdentifier, messages){

    console.log(serviceIdentifier, messages);
    return `${[...messages]
        .map(([key, value]) => {
            return key ? `<tr><td>${key.receiver}</td><td>${key.fileReference}</td><td>${key.receiptId}</td></tr>` : null
        }).join('')
        }`;
}

poll = (url, serviceIdentifier, targetElement) => {

    axios.get(url).then((res) => {
        emptyMessages(targetElement);
        targetElement.innerHTML = messageTable(serviceIdentifier, Array.from(new Map(res.data)));
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





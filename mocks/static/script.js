const deleteButtons = document.querySelectorAll('.delete-button');

let dpfMessageContainer = document.getElementById('DPF-messages');
let dpoMessageContainer = document.getElementById('DPO-messages');
let dpvMessageContainer = document.getElementById('DPV-messages');
let dpeMessageContainer = document.getElementById('DPE-messages');

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

function messageTable(serviceIdentifier, messages){
    return `${[...messages]
        .map(([key, value]) => {
            return key ? `<tr><td>${key.receiver}</td><td>${key.fileReference}</td><td>${key.receiptId}</td></tr>` : null
        }).join('')
        }`;
}

function messageTable2(serviceIdentifier, messages, headers){
    console.log('headers', headers);

    console.log('messages', messages);

    return `${messages
        .map((entry) => {
            return entry ?
                `<tr>${headers.map(header => `<td>${entry[header.accessor]}</td>`).join('')}</tr>` 
                : null
        }).join('')}`;
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

        if (serviceIdentifier === 'DPO') {
            console.log(res.data);
            console.log(messageTable2(serviceIdentifier, res.data, headers));
        }



        targetElement.innerHTML = messageTable2(serviceIdentifier, res.data, headers);
    });
};

axios.get('/api/messages/dpf').then((res) => {
    this.timer = setInterval(()=> this.poll('/api/messages/dpf', 'DPF', dpfMessageContainer), 5000);
});

setTimeout(() => {
    axios.get('/api/messages/dpo').then((res) => {
        this.timer = setInterval(()=> this.poll2('/api/messages/dpo', 'DPO',  dpoMessageContainer, dpoHeaders), 5000);
    });
}, 1000);


// let res =
//     [[{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/SMukV.zip","fileReference":"SMukV","receiptId":"di6p3ow","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/7H9C4.zip","fileReference":"7H9C4","receiptId":"itpmt0s","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/xH8Yi.zip","fileReference":"xH8Yi","receiptId":"7qd5d3c","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/ttZLM.zip","fileReference":"ttZLM","receiptId":"9m3i36k","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/s5ffu.zip","fileReference":"s5ffu","receiptId":"uh8uq6j","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/0VShk.zip","fileReference":"0VShk","receiptId":"q9d218m","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/Gn6X8.zip","fileReference":"Gn6X8","receiptId":"asl4flx","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/SETV6.zip","fileReference":"SETV6","receiptId":"m0yiov5","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/WexAp.zip","fileReference":"WexAp","receiptId":"kk3sd10","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/fDtav.zip","fileReference":"fDtav","receiptId":"fig15u5","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/lZqai.zip","fileReference":"lZqai","receiptId":"odd7gft","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/pxpUm.zip","fileReference":"pxpUm","receiptId":"slaselc","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/4MlVz.zip","fileReference":"4MlVz","receiptId":"ld0itog","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/0aWMc.zip","fileReference":"0aWMc","receiptId":"fpmknt2","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/bZpgX.zip","fileReference":"bZpgX","receiptId":"n4m3mml","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/UvOzh.zip","fileReference":"UvOzh","receiptId":"elu81bg","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/CTxPb.zip","fileReference":"CTxPb","receiptId":"on4lhtj","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/dQIo8.zip","fileReference":"dQIo8","receiptId":"x9ttfpc","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/qy69H.zip","fileReference":"qy69H","receiptId":"0et5wks","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/WyW9X.zip","fileReference":"WyW9X","receiptId":"y39be8g","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/bCLfh.zip","fileReference":"bCLfh","receiptId":"a766qli","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/M3XHY.zip","fileReference":"M3XHY","receiptId":"qornuly","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/S322V.zip","fileReference":"S322V","receiptId":"2ujf83x","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/ezJNT.zip","fileReference":"ezJNT","receiptId":"loyimmp","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/LxBdV.zip","fileReference":"LxBdV","receiptId":"yw1pkk8","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/5Y6Sz.zip","fileReference":"5Y6Sz","receiptId":"ecitf2j","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/OItOH.zip","fileReference":"OItOH","receiptId":"6yv1srp","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/PGmuf.zip","fileReference":"PGmuf","receiptId":"ddcqyyh","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/xtLuA.zip","fileReference":"xtLuA","receiptId":"fcqqgkq","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/BfDUn.zip","fileReference":"BfDUn","receiptId":"yqu4uw3","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/sw9Tn.zip","fileReference":"sw9Tn","receiptId":"uepn8ur","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/CFWj9.zip","fileReference":"CFWj9","receiptId":"y241jv4","receiver":"991825827"},{"file":"/Users/adam.haeger/Projects/mocks/mocks/src/modules/DPO/uploads/3oM4y.zip","fileReference":"3oM4y","receiptId":"hp4xvc1","receiver":"991825827"}]]
//
// let table = messageTable2('DPO', res[0], dpoHeaders)
// dpoMessageContainer.innerHTML = table;


setTimeout(() => {
    axios.get('/api/messages/dpv').then((res) => {
        this.timer = setInterval(()=> this.poll2('/api/messages/dpv', 'DPV',  dpvMessageContainer, dpvHeaders), 1000);
    });
}, 2000);

setTimeout(() => {
    axios.get('/api/messages/dpe').then((res) => {
        this.timer = setInterval(()=> this.poll2('/api/messages/dpe', 'DPE',  dpeMessageContainer, dpeHeaders), 1000);
    });
}, 3000);




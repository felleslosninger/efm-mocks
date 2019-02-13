
const deleteButtons = document.querySelectorAll('.delete-button');

console.log(window.location.href);

deleteButtons.forEach(button => {

    console.log(button.dataset.serviceidentifier);

    button.addEventListener('click', function(e){

        axios.post(`${window.location.href}api/messages/${button.dataset.serviceidentifier}`)
            .then(function(res){
                console.log("success", res);
            })
            .catch(function(err){
                console.log("fail", err);
            });
    });
});


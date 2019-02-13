// let deleteButtons = document.getElementsByClassName('delete-button');

// [].call

const deleteButtons = document.querySelectorAll('.delete-button');

console.log(deleteButtons);

deleteButtons.forEach(button => {

    console.log(button.dataset.serviceidentifier);

    button.addEventListener('click', function(e){

        console.log("click");

        axios.delete(`/api/messages/${button.dataset.serviceidentifier}`)
            .then(function(res){
                console.log("success", res);
            })
            .catch(function(err){
                console.log("fail", err);
            });
    });
});


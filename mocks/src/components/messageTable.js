let dpfDB= require("../modules/DPF/dpfDB").dpfDB;

function messageTable(serviceIdentifier, messages){
    let deleteButtonId = `delete-button-${serviceIdentifier}`;
    return `
    <button class="btn btn-primary delete-button" id="${deleteButtonId}" data-serviceIdentifier="${serviceIdentifier}">Delete</button>
   
    <h3>Received ${serviceIdentifier} messages</h3>

    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Receiver</th>
          <th scope="col">Last</th>
          <th scope="col">Handle</th>
        </tr>
      </thead>
      <tbody>
      
      ${[...messages].map(([key, value]) => `<tr>Receiver: ${key}  ${value} </tr>` ).join('') }
    
      </tbody>
    </table>`;
}

module.exports = messageTable;
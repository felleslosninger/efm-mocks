
function messageTable(serviceIdentifier, messages){
    let deleteButtonId = `delete-button-${serviceIdentifier}`;
    return `
    <button class="btn btn-primary delete-button" id="${deleteButtonId}" data-serviceIdentifier="${serviceIdentifier}">Delete</button>
   
    <h3>Received ${serviceIdentifier} messages</h3>

    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Receiver</th>
          <th scope="col">File Reference</th>
          <th scope="col">Recipt ID</th>
        </tr>
      </thead>
      <tbody id="${serviceIdentifier}-messages">
      </tbody>
    </table>`;
}

module.exports = messageTable;



//${[...messages].map(([key, value]) => `<tr>Receiver: ${key}  ${JSON.stringify(value, null, 2)} </tr>` ).join('') }
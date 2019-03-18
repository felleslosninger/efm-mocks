
function messageTable(headers, serviceIdentifier, messages){
    let deleteButtonId = `delete-button-${serviceIdentifier}`;
    return `
    <button class="btn btn-primary delete-button" id="${deleteButtonId}" data-serviceIdentifier="${serviceIdentifier}">Delete</button>
   
    <h3>Received ${serviceIdentifier} messages</h3>

    <table class="table table-striped">
      <thead>
        <tr>${ headers.map(header => `<th scope="col">${header.title}</th>`).join('') }</tr>
      </thead>
      <tbody id="${serviceIdentifier}-messages">
      </tbody>
    </table>`;
}

module.exports = { messageTable };
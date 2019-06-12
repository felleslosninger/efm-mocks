
let styles = {
    buttonContainer: `
        display: flex;
        justify-content: flex-end;
        float: right;`
};

function messageTable(headers, serviceIdentifier){
    let deleteButtonId = `delete-button-${serviceIdentifier}`;
    return `
            <div style="${styles.buttonContainer}"> 
                <button class="btn btn-primary clear-log-button" id="${deleteButtonId}-log" data-serviceIdentifier="${serviceIdentifier}">Clear log</button>
                <button class="btn btn-primary delete-button" id="${deleteButtonId}" data-serviceIdentifier="${serviceIdentifier}">Delete messages</button>
            </div>
                
               
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
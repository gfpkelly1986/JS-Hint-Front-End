const API_KEY = 'sdaoxxIhTkbs8SFtrvhCPthihXU';

const API_URL = 'https://ci-jshint.herokuapp.com/api';

const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));
document.getElementById('submit').addEventListener('click', e => postForm(e));


function processOptions(form) {
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === 'options') {
            optArray.push(entry[1]);
        }
    }
    console.log(optArray)
    // The formData object has form.delete and form.append methods.
    for (let entry of form.entries()) {
        console.log(entry)
    }
    form.delete('options');

    for (let entry2 of form.entries()) {
        console.log('Entry before appending option to form ' + entry2)
    }

    form.append('options', optArray.join());

    for (let entry3 of form.entries()) {
        console.log(entry3)
    }
    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById('checksform')));
    // This is code loops through the form object to get its entries() values.
    /*
    for (let entry of form.entries()) {
        console.log(entry)
    }
    */
    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body: form,
                        })
                        
    const data = await response.json();
                        
    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    
    let heading = `JSHint Results for ${data.file}`;
    let results = '';

    if (data.total_errors === 0){
        results = `<div class = 'no_errors'>No errors reported!</div>`;
    } else {
        results = `<div> Total Errors: <span class='error_count'>${data.total_errors}</span></div>`

        for (let error of data.error_list){
            results += `<div> At line <span class='line'>${error.line}</span>,  `;
            results += `column <span class='column'>${error.col}</span></div>`;
            results += `<div class='error'>${error.error}</div>`
        }
    }

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}

// Asynchronous functions that make a request to the API.
async function getStatus(e) {
    // Thsi line is a GET request to the API server: Its composed of a URL and an API key which pings the server with a request
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayStatus(data) {

    let heading = 'API Key Status';
    let results = `<div>Your key is valid until</div>`;
    results += `<div class='key-status'>${data.expiry}</div>`;

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}

function displayException(data) {
    let heading = `An Exception Occurred`;

    results = `<div>The API returned status code: <strong>${data.status_code}</strong></div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();

}



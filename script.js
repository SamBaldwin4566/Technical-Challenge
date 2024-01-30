let productID = document.getElementById("productStatusID");
let costData = document.getElementById('costData')
let taskArray = []
let cost = 0
let tableBody = document.getElementById("tableBody")
let modal = document.getElementById("modal")


// Validate that the Product Status ID is entered and display an error if not.
// Validate that the Product Status ID is an integer and display an error if not.
function validate() {
    if (isNaN(productID.value) || productID.value == "") {
        productID.style.background = "red";
        event.preventDefault();
        alert("Invalid Input")
    }
    else {
        productID.style.background = "white";
        event.preventDefault();
        recieveTaskIDs()
        
    }
    
}


// Use the Request the task IDs of a workflow status API endpoint to reieve a list of tasks as JSON for the provided Product Status ID = 1043 and provided API key
function recieveTaskIDs() {

    modal.style.display = "block"

    fetch(`https://demonstration.swiftcase.co.uk/api/v2/ekmp02uzhdgjpzm1p64qi71535azjgto/status/${productID.value}.json`)
    .then(response => {
        return response.json();
     })
     .then(data => {
        
        let taskIdsArray = data.task_ids
        for (i=0; i<taskIdsArray.length; i++) {
            let taskID = taskIdsArray[i].id
            recieveTaskDetails(taskID)
        }
        
     });
}


// Use the Resquest details of a taks API endpoint to get the details of each task returned in the previous results.
function recieveTaskDetails(para) {
        
        fetch(`https://demonstration.swiftcase.co.uk/api/v2/ekmp02uzhdgjpzm1p64qi71535azjgto/task/${para}.json`)
        .then(response => {
            return response.json();
         })
         .then(data => {

            // Store the data returned from each request in an array
            taskArray.push(data)

            populateTable(data.data)
            calculateCost(data.data)

            
            
         });
    
}

// Output the data in a modal
function populateTable(para) {
    let newRow = document.createElement("tr")
    for (x in para) {
        let td = document.createElement("td")


        // Format each of the date columns as a Unix Timestamp
        if (para[x].name == "date_ordered") {
            let date = para[x].value
            let newDate = new Date(date)
            let unixTimestamp = Math.floor(newDate.getTime()/1000)
            para[x].value = unixTimestamp
        }
        
        td.innerHTML = para[x].value
        newRow.appendChild(td)
 
    }
    tableBody.appendChild(newRow)
}


//Sum the cost data for each task where Cancelled = "No". Format the calculated answer as £X.XX
function calculateCost(para) {

    if (para[2].value == 'No') {
        cost = (cost + Number(para[0].value))
        
        costData.innerHTML = `Total Cost: £${cost.toFixed(2)}`
    }
}



// Send the data to the Upload a file to a task API endpoint using the FILE Upload Task ID provided as a base-64 encoded string using the ".txt" extension on the FILE_NAME parameter and MIME_FILE_TYPE = "text/plain"
function uploadData() {
    
    // let base64 = btoa(taskArray)
    

    // fetch('https://demonstration.swiftcase.co.uk/api/v2/ekmp02uzhdgjpzm1p64qi71535azjgto/task/362.json', {
    //     method:"post",
    //     mode: 'no-cors',

    //     body: JSON.stringify({
    //         "name":"file.txt",
    //         "type": "text/plain",
    //         "data": `${base64}`
    //     }),
    // })
    // .then(response => {
    //     response.json();
    //  })
    //  .then(data => {
    //     console.log(data)
    //  })
}

// Add a close button to the modal that closes it
function closeModal() {
    //Reset Variables
    taskArray = []
    tableBody.innerHTML = ""
    cost = 0

    modal.style.display = "none"
}
// This event listener ensures that the DOM content is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
    // Modal initialization for the "Add Request" modal
    var addRequestModal = new bootstrap.Modal(document.getElementById('addRequestModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    // DOM elements references
    var requestList = document.getElementById('requestList');
    var sortByDateLost = document.getElementById('sortByDateLost');
    var sortByDateFound = document.getElementById('sortByDateFound');

    // Event listener for the "Add Request" button, showing the modal when clicked
    document.getElementById('addRequestBtn').addEventListener('click', function () {
        addRequestModal.show();
    });

    // Event listener for the "OK" button inside the "Add Request" modal
    document.getElementById('submitRequestBtn').addEventListener('click', function () {
        // Getting values from the form inputs
        var itemName = document.getElementById('itemName').value.trim();
        var category = document.getElementById('category').value.trim();
        var lastLocation = document.getElementById('lastLocation').value.trim();
        var dateLost = document.getElementById('dateLost').value.trim();
        var itemDescription = document.getElementById('itemDescription').value.trim();
        var imageInput = document.getElementById('image');

        // Checking if all required fields are filled
        if (itemName && category && lastLocation && dateLost && itemDescription) {
            // Handling optional image input
            var currentDate = new Date();
            var image = imageInput.files.length > 0 ? imageInput.files[0] : null;
            var imageUrl = image ? URL.createObjectURL(image) : null;

            // Creating a new list item to display the added request
            var newItem = document.createElement("li");
            newItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start");
            newItem.innerHTML = `
                <div class="d-flex align-items-start">
                    ${imageUrl ? `<img src="${imageUrl}" alt="Uploaded Image" style="max-width: 200px; margin-right: 10px;">` : ''}
                    <div>
                        <strong>Item Name:</strong> ${itemName}<br>
                        <strong>Category:</strong> ${category}<br>
                        <strong>Date Added:</strong> ${currentDate}<br>
                    </div>
                </div>
                <div class="text-end">
                    <!-- "View Details" button -->
                    <button class="btn btn-primary mt-2 view-details-btn" 
                            data-bs-toggle="modal" 
                            data-bs-target="#viewDetailsModal" 
                            data-item-name="${itemName}" 
                            data-category="${category}" 
                            data-date-lost="${dateLost}" 
                            data-item-description="${itemDescription}"
                            data-last-location="${lastLocation}">
                        View Details
                    </button>
                </div>
            `;

            // Setting date properties for sorting
            newItem.dateLost = new Date(dateLost);
            newItem.dateFound = currentDate;
            newItem.dateTimeAdded = currentDate;

            // Appending the new item to the request list
            requestList.appendChild(newItem);

            // Clearing input values
            document.getElementById('itemName').value = '';
            document.getElementById('category').value = '';
            document.getElementById('lastLocation').value = '';
            document.getElementById('dateLost').value = '';
            document.getElementById('itemDescription').value = '';
            document.getElementById('image').value = '';

            // Hiding the "Add Request" modal
            addRequestModal.hide();

            // Triggering focus on the next input field
            triggerEnterKeyPress('category');
        } else {
            // Alert if not all required fields are filled
            alert("Please fill in all required fields.");
        }
    });

    // Event listeners for sorting buttons
    sortByDateLost.addEventListener('click', function () {
        sortItems('dateLost');
    });

    sortByDateFound.addEventListener('click', function () {
        sortItems('dateTimeAdded');
    });

    // Event listeners for handling Enter key press for moving to the next input field
    document.getElementById('itemName').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'category');
    });

    document.getElementById('category').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'lastLocation');
    });

    document.getElementById('lastLocation').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'dateLost');
    });

    document.getElementById('dateLost').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'itemDescription');
    });

    document.getElementById('itemDescription').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'image');
    });

    // Event listener for handling clicks on the request list to view details
    requestList.addEventListener('click', function (event) {
        if (event.target.classList.contains('view-details-btn')) {
            // Extracting data attributes for item details
            var dateLost = event.target.dataset.dateLost;
            var itemDescription = event.target.dataset.itemDescription;
            var lastLocation = event.target.dataset.lastLocation;

            // Logging item details to the console
            console.log("Item ID")
            console.log('Last Location:', lastLocation);
            console.log('Date Lost:', dateLost);
            console.log('Item Description:', itemDescription);

            // Updating the details modal with the extracted data
            document.getElementById('viewDetailsLastLocation').textContent = `Last Location: ${lastLocation}`;
            document.getElementById('viewDetailsDateLost').textContent = `Date Lost: ${dateLost}`;
            document.getElementById('viewDetailsItemDescription').textContent = `Item Description: ${itemDescription}`;

            // Showing the details modal
            $('#viewDetailsModal').modal('show');
        }
    });

    // Function to handle Enter key press
    function handleEnterKeyPress(event, nextInputId) {
        if (event.key === 'Enter') {
            event.preventDefault();
            triggerEnterKeyPress(nextInputId);
        }
    }

    // Function to trigger Enter key press and focus on the next input field
    function triggerEnterKeyPress(nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    }

    // Function to perform search based on user input
    function performSearch() {
        var searchInput = document.getElementById('searchInput').value.trim().toLowerCase();

        // Filtering and displaying items based on search input
        Array.from(requestList.children).forEach(function (item) {
            var itemNameElement = item.querySelector('strong:nth-child(1)');
            var categoryElement = item.querySelector('strong:nth-child(2)');

            if (itemNameElement && categoryElement) {
                var itemName = itemNameElement.textContent.trim().toLowerCase();
                var category = categoryElement.textContent.trim().toLowerCase();

                var isMatch = itemName.includes(searchInput) || category.includes(searchInput);
                item.style.display = isMatch ? 'flex' : 'none';
            }
        });

        // TODO: Handle user search for other elements (users in this case) if needed
        users.forEach(user => {
            const isVisible =
                user.name.toLowerCase().includes(searchInput) ||
                user.email.toLowerCase().includes(searchInput);
            user.element.classList.toggle("hide", !isVisible);
        });
    }

    // Function to sort items based on a given criterion
    function sortItems(sortCriterion) {
        var items = Array.from(requestList.children);

        items.sort(function (a, b) {
            var dateA = a[sortCriterion];
            var dateB = b[sortCriterion];

            return dateB - dateA;
        });

        items.forEach(function (item) {
            requestList.removeChild(item);
        });

        items.forEach(function (item) {
            requestList.appendChild(item);
        });
    }
});

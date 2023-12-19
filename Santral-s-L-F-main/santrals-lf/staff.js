// Declare modal variables
var addRequestModal, editItemModal, sendMessageModal;

// Execute code when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Initialize Bootstrap modals
    addRequestModal = new bootstrap.Modal(document.getElementById('addRequestModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    sendMessageModal = new bootstrap.Modal(document.getElementById('sendMessageModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    // Get DOM elements
    var requestList = document.getElementById('requestList');
    var sortByDateLost = document.getElementById('sortByDateLost');
    var sortByDateFound = document.getElementById('sortByDateFound');

    // Event listener for "Add Request" button click
    document.getElementById('addRequestBtn').addEventListener('click', function () {
        addRequestModal.show();
    });

    // Event listener for "Submit Request" button click
    document.getElementById('submitRequestBtn').addEventListener('click', function () {
        // Retrieve input values
        var itemName = document.getElementById('itemName').value.trim();
        var category = document.getElementById('category').value.trim();
        var lastLocation = document.getElementById('lastLocation').value.trim();
        var dateLost = document.getElementById('dateLost').value.trim();
        var itemDescription = document.getElementById('itemDescription').value.trim();
        var imageInput = document.getElementById('image');

        // Check if required fields are filled
        if (itemName && category && lastLocation && dateLost && itemDescription) {
            // Process image input
            var image = imageInput.files.length > 0 ? imageInput.files[0] : null;
            var imageUrl = image ? URL.createObjectURL(image) : null;

            // Get current date and time
            var currentDate = new Date();
            var dateTimeAdded = currentDate.toLocaleString();

            // Create new list item
            var newItem = document.createElement("li");
            newItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start");
            newItem.innerHTML = `
                <div class="d-flex align-items-start">
                    ${imageUrl ? `<img src="${imageUrl}" alt="Uploaded Image" style="max-width: 200px; margin-right: 10px;">` : ''}
                    <div>
                        <strong>Item Name:</strong> ${itemName}<br>
                        <strong>Category:</strong> ${category}<br>
                        <strong>Date Added:</strong> ${dateTimeAdded}<br>
                    </div>
                </div>
                <div class="text-end">
                    <button class="btn btn-secondary mt-2 text-student-btn" data-bs-dismiss="modal" id="textStudentBtn">
                        Text Student
                    </button>
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
                    <button class="btn btn-warning mt-2 edit-item-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#editItemModal"
                            data-item-name="${itemName}"
                            data-category="${category}"
                            data-last-location="${lastLocation}"
                            data-date-lost="${dateLost}"
                            data-item-description="${itemDescription}">
                        Edit
                    </button>
                </div>
            `;

            // Set custom properties for sorting
            newItem.dateLost = new Date(dateLost);
            newItem.dateFound = currentDate;
            newItem.dateTimeAdded = currentDate;

            // Append the new item to the list
            requestList.appendChild(newItem);

            // Clear input fields
            document.getElementById('itemName').value = '';
            document.getElementById('category').value = '';
            document.getElementById('lastLocation').value = '';
            document.getElementById('dateLost').value = '';
            document.getElementById('itemDescription').value = '';
            document.getElementById('image').value = '';

            // Close the "Add Request" modal
            addRequestModal.hide();

            // Focus on the next input field
            triggerEnterKeyPress('category');
        } else {
            // Alert if required fields are not filled
            alert("Please fill in all required fields.");
        }
    });

    // Event listener for "Date Lost" sort button click
    sortByDateLost.addEventListener('click', function () {
        sortItems('dateLost');
    });

    // Event listener for "Date Added" sort button click
    sortByDateFound.addEventListener('click', function () {
        sortItems('dateTimeAdded');
    });

    // Event listeners for keyboard navigation
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

    // Event listener for interactions within the request list
    requestList.addEventListener('click', function (event) {
        // Open "Send Message" modal on button click
        if (event.target.classList.contains('text-student-btn')) {
            sendMessageModal.show();
        }

        // Display details in modal on "View Details" button click
        if (event.target.classList.contains('view-details-btn')) {
            var dateLost = event.target.dataset.dateLost;
            var itemDescription = event.target.dataset.itemDescription;
            var lastLocation = event.target.dataset.lastLocation;

            console.log('Last Location:', lastLocation);
            console.log('Date Lost:', dateLost);
            console.log('Item Description:', itemDescription);

            document.getElementById('viewDetailsLastLocation').textContent = `Last Location: ${lastLocation}`;
            document.getElementById('viewDetailsDateLost').textContent = `Date Lost: ${dateLost}`;
            document.getElementById('viewDetailsItemDescription').textContent = `Item Description: ${itemDescription}`;

            // Show the "View Details" modal
            $('#viewDetailsModal').modal('show');
        }

        // Populate "Edit Item" modal on "Edit" button click
        if (event.target.classList.contains('edit-item-btn')) {
            var itemName = event.target.dataset.itemName;
            var category = event.target.dataset.category;
            var lastLocation = event.target.dataset.lastLocation;
            var dateLost = event.target.dataset.dateLost;
            var itemDescription = event.target.dataset.itemDescription;

            // Fill in the input fields with existing data
            document.getElementById('editItemName').value = itemName;
            document.getElementById('editItemCategory').value = category;
            document.getElementById('editItemLastLocation').value = lastLocation;
            document.getElementById('editItemDateLost').value = dateLost;
            document.getElementById('editItemDescription').value = itemDescription;

            // Show the "Edit Item" modal
            editItemModal.show();
        }
    });

    // Event listener for "Send Message" button click
    document.getElementById('sendMessageBtn').addEventListener('click', function () {
        var messageContent = document.getElementById('messageContent').value.trim();

        // Add your logic to send the message (e.g., AJAX request, etc.)

        // Close the "Send Message" modal after sending the message
        sendMessageModal.hide();
    });

    // Event listener for "Save Changes" button click
    document.getElementById('saveChangesBtn').addEventListener('click', function () {
        // Retrieve edited item details
        var editedItemName = document.getElementById('editItemName').value.trim();
        var editedItemCategory = document.getElementById('editItemCategory').value.trim();
        var editedItemLastLocation = document.getElementById('editItemLastLocation').value.trim();
        var editedItemDateLost = document.getElementById('editItemDateLost').value.trim();
        var editedItemDescription = document.getElementById('editItemDescription').value.trim();

        console.log("Save Changes button clicked!");
        console.log("Edited Item Name:", editedItemName);
        console.log("Edited Item Category:", editedItemCategory);

        // Get the selected item for editing
        var selectedItem = document.querySelector('.edit-item-btn:focus').closest('li');
        console.log("Selected Item:", selectedItem);

        // Update displayed details
        selectedItem.querySelector('strong:nth-child(1)').textContent = `Item Name: ${editedItemName}`;
        selectedItem.querySelector('strong:nth-child(2)').textContent = `Category: ${editedItemCategory}`;

        // Update dataset for future reference
        selectedItem.dataset.itemName = editedItemName;
        selectedItem.dataset.category = editedItemCategory;
        selectedItem.dataset.lastLocation = editedItemLastLocation;
        selectedItem.dataset.dateLost = editedItemDateLost;
        selectedItem.dataset.itemDescription = editedItemDescription;

        // Close the "Edit Item" modal
        editItemModal.hide();
    });

    // Handle Enter key press for navigation
    function handleEnterKeyPress(event, nextInputId) {
        if (event.key === 'Enter') {
            event.preventDefault();
            triggerEnterKeyPress(nextInputId);
        }
    }

    // Trigger Enter key press for navigation
    function triggerEnterKeyPress(nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    }

    // Sort items based on the specified criterion
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

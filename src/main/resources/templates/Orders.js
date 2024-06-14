$(document).ready(function() {
    // Check authentication on page load
    checkAuthentication();

    // Load user orders
    loadUserOrders();

    // Function to check authentication
    function checkAuthentication() {
        const token = localStorage.getItem('token');
        if (!token) {
            // If no token, redirect to login page
            window.location.href = 'index.html';
        } else {
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8080/api/current-user',
                headers: {'Authorization': 'Bearer ' + token},
                success: function (response) {
                    if (response.role === 'ROLE_BLOCKED') {
                        window.location.href = 'Blocked.html';
                    }
                },
                error: function () {
                    window.location.href = 'Profile.html';
                }
            });
        }
    }

    // Function to load user orders
    function loadUserOrders() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/orders/user',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function(response) {
                displayUserOrders(response);
            },
            error: function(xhr, status, error) {
                alert('Failed to load user orders: ' + xhr.responseText);
            }
        });
    }

    // Function to display user orders
    function displayUserOrders(orders) {
        var ordersListTable = $('<table>').addClass('orders-table');
        var headerRow = $('<tr>').append(
            $('<th>').text('Order ID'),
            $('<th>').text('Order Date'),
            $('<th>').text('Full Name'),
            $('<th>').text('Address'),
            $('<th>').text('Phone Number'),
            $('<th>').text('Total Price'),
            $('<th>').text('Status'),
            $('<th>').text('Actions')
        );
        ordersListTable.append(headerRow);

        orders.forEach(function(order) {
            var orderDate = new Date(order.orderDate);
            var formattedDate = formatDate(orderDate);

            var orderRow = $('<tr>').append(
                $('<td>').text(order.id),
                $('<td>').text(formattedDate),
                $('<td>').text(order.fullName),
                $('<td>').text(order.address),
                $('<td>').text(order.phoneNumber),
                $('<td>').text('$' + order.totalPrice.toFixed(2)),
                $('<td>').text(order.status),
                $('<td>').append($('<button>').text('More Details').addClass('btn').click(function() {
                    toggleOrderDetails(order.id);
                }))
            );
            ordersListTable.append(orderRow);

            // Create a row for order details (hidden by default)
            var orderDetailsRow = $('<tr>').addClass('order-details').attr('id', 'order-details-' + order.id).hide();
            var orderDetailsCell = $('<td>').attr('colspan', 8);
            orderDetailsRow.append(orderDetailsCell);
            ordersListTable.append(orderDetailsRow);
        });

        $('#ordersList').append(ordersListTable);
    }

    // Function to format date
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    // Function to toggle order details
    function toggleOrderDetails(orderId) {
        var detailsRow = $('#order-details-' + orderId);
        if (detailsRow.is(':visible')) {
            detailsRow.hide();
        } else {
            if (detailsRow.find('table').length === 0) {
                loadOrderDetails(orderId, detailsRow);
            } else {
                detailsRow.show();
            }
        }
    }

    // Function to load order details
    function loadOrderDetails(orderId, detailsRow) {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/orders/' + orderId,
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function(response) {
                displayOrderDetails(response, detailsRow);
            },
            error: function(xhr, status, error) {
                alert('Failed to load order details: ' + xhr.responseText);
            }
        });
    }

    // Function to display order details
    function displayOrderDetails(order, detailsRow) {
        var orderItemsTable = $('<table>').addClass('order-items-table');
        var headerRow = $('<tr>').append(
            $('<th>').text('Product Name'),
            $('<th>').text('Quantity')
        );
        orderItemsTable.append(headerRow);

        order.orderItems.forEach(function(item) {
            var itemRow = $('<tr>').append(
                $('<td>').text(item.productName),
                $('<td>').text(item.quantity)
            );
            orderItemsTable.append(itemRow);
        });

        detailsRow.find('td').append(orderItemsTable);
        detailsRow.show();
    }

    // Navigate to product list
    $('#ProductListBtn').click(function() {
        window.location.href = 'ProductList.html';
    });

    // Navigate to product list
    $('#OrderPaymentsBtn').click(function() {
        window.location.href = 'OrdersPayments.html';
    });
});

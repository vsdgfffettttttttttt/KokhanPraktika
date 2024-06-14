$(document).ready(function() {
    // Проверка авторизации при загрузке страницы
    checkAuthentication();

    // Загрузка всех заказов
    loadAllOrders();

    // Обработчики событий
    $('#searchUserBtn').click(searchByUserId);
    $('#searchOrderBtn').click(searchByOrderId);
    $('#showAllOrdersBtn').click(loadAllOrders);
    $('#closeModal').click(closeModal);

    // Обработчик кнопок изменения статуса
    $('.status-btn').click(changeOrderStatus);

    // Функция для проверки авторизации и роли
    function checkAuthentication() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'Profile.html';
        } else {
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8080/api/current-user',
                headers: { 'Authorization': 'Bearer ' + token },
                success: function(response) {
                    if (response == null || response.role !== 'ROLE_ADMIN') {
                        window.location.href = 'Orders.html';
                    } else if (response.role === 'ROLE_BLOCKED') {
                        window.location.href = 'Blocked.html';
                    }
                },
                error: function() {
                    window.location.href = 'Profile.html';
                }
            });
        }
    }


    // Функция для загрузки всех заказов
    function loadAllOrders() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/orders/all',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function(response) {
                displayOrders(response);
            },
            error: function(xhr) {
                alert('Failed to load orders: ' + xhr.responseText);
            }
        });
    }

    // Функция для поиска заказов по ID пользователя
    function searchByUserId() {
        const userId = $('#searchUserId').val();
        if (userId) {
            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/api/orders/user/${userId}`,
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                success: function(response) {
                    displayOrders(response);
                },
                error: function(xhr) {
                    alert('Failed to load orders: ' + xhr.responseText);
                }
            });
        } else {
            alert('Please enter a User ID');
        }
    }

    // Функция для поиска заказа по ID заказа
    function searchByOrderId() {
        const orderId = $('#searchOrderId').val();
        if (orderId) {
            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/api/orders/${orderId}`,
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                success: function(response) {
                    displayOrders([response]);
                },
                error: function(xhr) {
                    alert('Failed to load order: ' + xhr.responseText);
                }
            });
        } else {
            alert('Please enter an Order ID');
        }
    }

    // Функция для отображения заказов
    function displayOrders(orders) {
        var ordersListTable = $('<table>').addClass('orders-table');
        var headerRow = $('<tr>').append(
            $('<th>').text('Order ID'),
            $('<th>').text('User ID'), // Добавляем заголовок для столбца с User ID
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
                $('<td>').text(order.userId), // Добавляем столбец с User ID
                $('<td>').text(formattedDate),
                $('<td>').text(order.fullName),
                $('<td>').text(order.address),
                $('<td>').text(order.phoneNumber),
                $('<td>').text('$' + order.totalPrice.toFixed(2)),
                $('<td>').text(order.status),
                $('<td>').append(
                    $('<button>').text('Изменить статус').attr('data-order-id', order.id).click(openModal),
                    $('<button>').text('Удалить').attr('data-order-id', order.id).click(deleteOrder)
                )
            );
            ordersListTable.append(orderRow);
        });

        $('#ordersList').empty().append(ordersListTable);
    }

    // Функция для открытия модального окна
    function openModal() {
        const orderId = $(this).data('order-id');
        $('#statusModal').data('order-id', orderId).show();
    }

    // Функция для закрытия модального окна
    function closeModal() {
        $('#statusModal').hide();
    }

    // Функция для изменения статуса заказа
    function changeOrderStatus() {
        const orderId = $('#statusModal').data('order-id');
        const newStatus = $(this).data('status');

        $.ajax({
            type: 'PUT',
            url: `http://localhost:8080/api/orders/${orderId}/status?newStatus=${newStatus}`,
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function() {
                alert('Order status updated successfully');
                closeModal();
                loadAllOrders();
            },
            error: function(xhr) {
                alert('Failed to update order status: ' + xhr.responseText);
            }
        });
    }

    // Функция для удаления заказа
    function deleteOrder() {
        const orderId = $(this).data('order-id');

        $.ajax({
            type: 'POST',
            url: `http://localhost:8080/api/orders/delete/${orderId}`,
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function() {
                alert('Order deleted successfully');
                loadAllOrders();
            },
            error: function(xhr) {
                alert('Failed to delete order: ' + xhr.responseText);
            }
        });
    }

    // Функция для форматирования даты в формате год-месяц-день
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + '-' + day;
    }
});

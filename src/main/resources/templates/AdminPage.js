$(document).ready(function() {
    // Проверка авторизации при загрузке страницы
    checkAuthentication();

    // Обработчики событий
    $('#ordersBtn').click(function() {
        window.location.href = 'AdminOrders.html';
    });

    $('#usersBtn').click(function() {
        window.location.href = 'AdminUsers.html';
    });

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
                        window.location.href = 'Profile.html';
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

});

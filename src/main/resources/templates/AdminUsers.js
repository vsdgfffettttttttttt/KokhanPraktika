$(document).ready(function() {
    // Проверка авторизации при загрузке страницы
    checkAuthentication();

    // Загрузка всех пользователей
    loadAllUsers();

    // Обработчики событий
    $('#searchUserBtn').click(searchByUserId);
    $('#showAllUsersBtn').click(loadAllUsers);
    $('#closeRoleModal').click(closeRoleModal);

    // Обработчик кнопок изменения роли
    $('.role-btn').click(changeUserRole);

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


    // Функция для загрузки всех пользователей
    function loadAllUsers() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/admin/users',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function(response) {
                displayUsers(response);
            },
            error: function(xhr) {
                alert('Failed to load users: ' + xhr.responseText);
            }
        });
    }

    // Функция для поиска пользователя по ID
    function searchByUserId() {
        const userId = $('#searchUserId').val();
        if (userId) {
            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/admin/users/${userId}`,
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                success: function(response) {
                    displayUsers([response]);
                },
                error: function(xhr) {
                    alert('Failed to load user: ' + xhr.responseText);
                }
            });
        } else {
            alert('Please enter a User ID');
        }
    }

    // Функция для отображения пользователей
    function displayUsers(users) {
        var usersListTable = $('<table>').addClass('users-table');
        var headerRow = $('<tr>').append(
            $('<th>').text('User ID'),
            $('<th>').text('Name'),
            $('<th>').text('Email'),
            $('<th>').text('Role'),
            $('<th>').text('Actions')
        );
        usersListTable.append(headerRow);

        users.forEach(function(user) {
            var userRow = $('<tr>').append(
                $('<td>').text(user.id),
                $('<td>').text(user.name),
                $('<td>').text(user.email),
                $('<td>').text(user.role),
                $('<td>').append(
                    $('<button>').text('Изменить роль').attr('data-user-id', user.id).click(openRoleModal)
                )
            );
            usersListTable.append(userRow);
        });

        $('#usersList').empty().append(usersListTable);
    }

    // Функция для открытия модального окна
    function openRoleModal() {
        const userId = $(this).data('user-id');
        $('#roleModal').data('user-id', userId).show();
    }

    // Функция для закрытия модального окна
    function closeRoleModal() {
        $('#roleModal').hide();
    }

    // Функция для изменения роли пользователя
    function changeUserRole() {
        const userId = $('#roleModal').data('user-id');
        const newRole = $(this).data('role');
        let url = '';

        switch (newRole) {
            case 'ADMIN':
                url = `http://localhost:8080/admin/assign-admin-role/${userId}`;
                break;
            case 'USER':
                url = `http://localhost:8080/admin/assign-user-role/${userId}`;
                break;
            case 'BANNED':
                url = `http://localhost:8080/admin/block-user/${userId}`;
                break;
        }

        $.ajax({
            type: 'PUT',
            url: url,
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function() {
                alert('User role updated successfully');
                closeRoleModal();
                loadAllUsers();
            },
            error: function(xhr) {
                alert('Failed to update user role: ' + xhr.responseText);
            }
        });
    }
});

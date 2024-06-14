$(document).ready(function() {
    // Обработчик отправки формы
    checkAuthentication();
    // Функция для проверки авторизации и роли
    function checkAuthentication() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'Profile.html';
        }
    }


    $('#changePasswordForm').submit(function(e) {
        e.preventDefault();
        var email = $('#email').val();
        var oldPassword = $('#oldPassword').val();
        var newPassword = $('#newPassword').val();
        var confirmPassword = $('#confirmPassword').val();

        // Проверка совпадения нового пароля и его подтверждения
        if (newPassword !== confirmPassword) {
            alert('Пароль и подтверждение пароля не совпадают!');
            return;
        }

        var changePasswordData = {
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        $.ajax({
            type: 'PUT',
            url: 'http://localhost:8080/api/change-password',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            contentType: 'application/json',
            data: JSON.stringify(changePasswordData),
            success: function(response) {
                alert('Пароль успешно изменен!');
            },
            error: function(xhr, status, error) {
                alert('Не удалось изменить пароль: ' + xhr.responseText);
            }
        });
    });
});

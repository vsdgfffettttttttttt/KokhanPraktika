$(document).ready(function() {
    // Функция для проверки авторизации при загрузке страницы
    function checkAuthentication() {
        const token = localStorage.getItem('token');
        if (token) {
            // Если токен есть, перенаправляем на страницу профиля
            window.location.href = 'profile.html';
        }
    }

    // Проверяем авторизацию при загрузке страницы
    checkAuthentication();

    // Регистрация
    $('#registrationForm').submit(function(e) {
        e.preventDefault();
        var name = $('#name').val();
        var email = $('#email').val();
        var password = $('#password').val();
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/sign-up',
            contentType: 'application/json',
            data: JSON.stringify({ name: name, email: email, password: password }),
            success: function(response) {
                alert('Registration successful');
            },
            error: function(xhr, status, error) {
                alert('Registration failed: ' + xhr.responseText);
            }
        });
    });

    // Авторизация
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        var email = $('#loginEmail').val();
        var password = $('#loginPassword').val();
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/authenticate',
            contentType: 'application/json',
            data: JSON.stringify({ email: email, password: password }),
            success: function(response) {
                localStorage.setItem('token', response.jwtToken);
                // Перенаправляем на страницу профиля после успешной авторизации
                window.location.href = 'profile.html';
            },
            error: function(xhr, status, error) {
                alert('Login failed: ' + xhr.responseText);
            }
        });
    });

});

$(document).ready(function() {
    checkAuthentication();

    function loadUserProfile() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/profile',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function(response) {
                $('#profileName').text(response.name);
                $('#profileEmail').text(response.email);
            },
            error: function(xhr, status, error) {
                alert('Failed to load user profile: ' + xhr.responseText);
            }
        });
    }

    function checkAuthentication() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
        } else {
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8080/api/current-user',
                headers: { 'Authorization': 'Bearer ' + token },
                success: function(response) {
                    if (response && response.role === 'ROLE_ADMIN') {
                        $('#adminPageBtn').show();
                    }
                    loadUserProfile();
                },
                error: function() {
                    window.location.href = 'index.html';
                }
            });
        }
    }

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
                loadUserProfile();
            },
            error: function(xhr, status, error) {
                alert('Login failed: ' + xhr.responseText);
            }
        });
    });

    $('#logoutBtn').click(function() {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    $('#changePasswordBtn').click(function() {
        window.location.href = 'change-password.html';
    });

    $('#myOrdersBtn').click(function() {
        window.location.href = 'Orders.html';
    });

    $('#adminPageBtn').click(function() {
        window.location.href = 'AdminPage.html';
    });
});

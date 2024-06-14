// Проверка авторизации при загрузке страницы
checkAuthentication();

// Проверка авторизации и роли пользователя при загрузке страницы
checkUserRole();
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


// Функция для проверки роли пользователя
function checkUserRole() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/current-user',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        success: function(response) {
            if (response && response.role === 'ROLE_ADMIN') {

            } else {
                // Если пользователь не администратор, перенаправляем его на страницу продуктов
                window.location.href = 'productList.html';
            }
        },
        error: function(xhr, status, error) {
            alert('Failed to fetch current user: ' + xhr.responseText);
        }
    });
}

function addProduct() {
    var photo = document.getElementById('photo').value;
    var name = document.getElementById('name').value;
    var description = document.getElementById('description').value;
    var price = document.getElementById('price').value;
    var quantity = document.getElementById('quantity').value;
    var type = document.getElementById('type').value; // Получаем выбранный тип товара

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/api/products/add", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                alert('Product added successfully');
                // Очистить форму после успешного добавления товара
                document.getElementById('photo').value = '';
                document.getElementById('name').value = '';
                document.getElementById('description').value = '';
                document.getElementById('price').value = '';
                document.getElementById('quantity').value = '';
            } else {
                alert('Failed to add product: ' + xhr.responseText);
            }
        }
    };
    var data = JSON.stringify({ photo: photo, name: name, description: description, price: price, quantity: quantity, type: type }); // Включаем тип товара в данные
    xhr.send(data);
}
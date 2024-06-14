$(document).ready(function() {
    // Проверка авторизации при загрузке страницы
    checkAuthentication();

    // Загрузка списка товаров
    loadProductList();

    // Проверка авторизации и роли пользователя при загрузке страницы
    checkUserRole();

    // Функция для проверки роли пользователя
    function checkUserRole() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/current-user',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function(response) {
                if (response && response.role === 'ROLE_ADMIN') {
                    // Если пользователь администратор, загружаем список товаров
                    loadProductList();
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


    // Функция для загрузки списка товаров
    function loadProductList() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/products/all',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function(response) {
                displayProductList(response);
            },
            error: function(xhr, status, error) {
                alert('Failed to load product list: ' + xhr.responseText);
            }
        });
    }

    // Функция для отображения списка товаров
    function displayProductList(products) {
        var productListDiv = $('#productList');
        productListDiv.empty();
        products.forEach(function(product) {
            var productDiv = $('<div>');
            productDiv.append('<h3>' + product.name + '</h3>');
            productDiv.append('<p>' + product.description + '</p>');
            productDiv.append('<p>Price: $' + product.price + '</p>');

            // Отображение картинки по ссылке
            var productImage = $('<img>').attr('src', product.photo).attr('alt', product.name).addClass('product-image');
            productDiv.append(productImage);

            // Поле для ввода количества товара с кнопками + и -
            var quantityField = $('<input>').attr('type', 'number').val(product.quantity);
            var incrementBtn = $('<button>').text('+');
            var decrementBtn = $('<button>').text('-');
            incrementBtn.click(function() {
                quantityField.val(parseInt(quantityField.val()) + 1);
            });
            decrementBtn.click(function() {
                quantityField.val(parseInt(quantityField.val()) - 1);
            });
            var updateQuantityBtn = $('<button>').text('Update Quantity');
            updateQuantityBtn.click(function() {
                var newQuantity = parseInt(quantityField.val());
                if (!isNaN(newQuantity)) {
                    updateProductQuantity(product.id, newQuantity);
                } else {
                    alert('Please enter a valid quantity.');
                }
            });
            productDiv.append(quantityField, incrementBtn, decrementBtn, updateQuantityBtn);

            // Кнопка "Удалить товар"
            var deleteBtn = $('<button>').text('Delete');
            deleteBtn.click(function() {
                showConfirmDeleteModal(product.id);
            });
            productDiv.append(deleteBtn);

            productListDiv.append(productDiv);
        });
    }

    // Функция для показа модального окна подтверждения удаления товара
    function showConfirmDeleteModal(productId) {
        $('#confirmDeleteModal').show();
        $('#confirmDeleteBtn').click(function() {
            deleteProduct(productId); // Удаляем товар при подтверждении
            $('#confirmDeleteModal').hide();
        });
        $('#cancelDeleteBtn').click(function() {
            $('#confirmDeleteModal').hide();
        });
    }

    // Функция для удаления товара
    function deleteProduct(productId) {
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:8080/api/products/' + productId,
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function(response) {
                alert('Product deleted successfully');
                loadProductList(); // После удаления обновляем список товаров
            },
            error: function(xhr, status, error) {
                alert('Failed to delete product: ' + xhr.responseText);
            }
        });
    }

    // Функция для обновления количества товара
    function updateProductQuantity(productId, newQuantity) {
        $.ajax({
            type: 'PUT',
            url: 'http://localhost:8080/api/products/' + productId + '?quantity=' + newQuantity,
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function(response) {
                alert('Quantity updated successfully');
                loadProductList(); // После успешного обновления на сервере обновляем данные в таблице
            },
            error: function(xhr, status, error) {
                alert('Failed to update product quantity: ' + xhr.responseText);
            }
        });
    }
    $(document).ready(function() {
        // Обработчик клика по кнопке "Product List"
        $('#ProductListBtn').click(function() {
            // Переходим на страницу ProductList.html
            window.location.href = 'ProductList.html';
        });
    });
});
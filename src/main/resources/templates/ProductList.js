$(document).ready(function() {
    // Проверка авторизации при загрузке страницы
    checkAuthentication();

    // Загрузка списка товаров по умолчанию (все товары)
    loadProductList();

    // Функция для проверки авторизации
    function checkAuthentication() {
        const token = localStorage.getItem('token');
        if (!token) {
            // Если токен отсутствует, перенаправляем на страницу регистрации и авторизации
            window.location.href = 'index.html';
        } else {
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8080/api/current-user',
                headers: { 'Authorization': 'Bearer ' + token },
                success: function(response) {
                    if (response && response.role === 'ROLE_ADMIN') {
                        $('#goToAddProductBtn').show();
                        $('#goToEditProductBtn').show();
                    } else if (response.role === 'ROLE_BLOCKED') {
                        window.location.href = 'Blocked.html';
                    }
                },
                error: function() {
                    window.location.href = 'index.html';
                }
            });
        }
    }

    // Функция для загрузки списка товаров в зависимости от выбранного типа
    function loadProductList() {
        var filterType = $('#sortProducts').val(); // получаем выбранный тип товара
        var url = 'http://localhost:8080/api/products/all'; // URL для получения всех товаров по умолчанию

        if (filterType !== 'all') {
            url = 'http://localhost:8080/api/products/type/' + filterType; // URL для получения товаров по конкретному типу
        }

        $.ajax({
            type: 'GET',
            url: url,
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function(response) {
                displayProductList(response);
            },
            error: function(xhr, status, error) {
                alert('Failed to load product list: ' + xhr.responseText);
            }
        });
    }

    // Обработчик клика на кнопку "Применить фильтр"
    $('#applyFilterBtn').click(function() {
        loadProductList(); // вызываем функцию загрузки товаров при применении фильтра
    });

    // Функция для отображения списка товаров
    function displayProductList(products) {
        var productListDiv = $('#productList');
        productListDiv.empty();
        products.forEach(function(product) {
            var productDiv = $('<div>').addClass('product-item');

            // Отображение картинки по ссылке
            var productImage = $('<img>').attr('src', product.photo).attr('alt', product.name).addClass('product-image');
            productDiv.append(productImage);

            // Добавление текстовой информации
            productDiv.append('<h3>' + product.name + '</h3>');
            productDiv.append('<p>' + product.description + '</p>');
            productDiv.append('<p>Price: $' + product.price + '</p>');
            productDiv.append('<p>Quantity: ' + product.quantity + '</p>');

            // Поле для ввода количества товара с кнопками + и -
            var quantityField = $('<input>').attr('type', 'number').val(1);
            var incrementBtn = $('<button>').text('+');
            var decrementBtn = $('<button>').text('-');
            incrementBtn.click(function() {
                quantityField.val(parseInt(quantityField.val()) + 1);
            });
            decrementBtn.click(function() {
                var quantity = parseInt(quantityField.val());
                if (quantity > 1) {
                    quantityField.val(quantity - 1);
                }
            });

            // Кнопка "Добавить в корзину"
            var addToCartBtn = $('<button>').text('Add to Cart');
            addToCartBtn.click(function() {
                addToCart(product.id, parseInt(quantityField.val()));
            });

            productDiv.append(quantityField, incrementBtn, decrementBtn, addToCartBtn);

            productListDiv.append(productDiv);
        });
    }

    // Функция для добавления товара в корзину
    function addToCart(productId, quantity) {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/cart/add/' + productId + '?quantity=' + quantity,
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function(response) {
                alert('Item added to cart');
            },
            error: function(xhr, status, error) {
                alert('Failed to add item to cart: ' + xhr.responseText);
            }
        });
    }

    // Обработчик клика по кнопке "Go to Cart"
    $('#goToCartBtn').click(function() {
        window.location.href = 'Cart.html'; // Переходим на страницу корзины
    });

    // Обработчик клика по кнопке "Add Product"
    $('#goToAddProductBtn').click(function() {
        window.location.href = 'ProductAdd.html'; // Переходим на страницу добавления товара
    });

    // Обработчик клика по кнопке "Edit Product"
    $('#goToEditProductBtn').click(function() {
        window.location.href = 'ProductAdmin.html'; // Переходим на страницу редактирования товара
    });
});

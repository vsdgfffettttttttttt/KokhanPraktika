$(document).ready(function() {
    // Load cart items on page load
    loadCartItems();

    checkAuthentication();

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
                    if (response == null || response.role === 'ROLE_BLOCKED') {
                        window.location.href = 'Blocked.html';
                    }
                },
                error: function() {
                    window.location.href = 'Profile.html';
                }
            });
        }
    }


    // Event listener for "Clear Cart" button
    $('#clearCartBtn').click(function() {
        clearCart();
    });

    // Event listener for "View Product List" button
    $('#goToProductListBtn').click(function() {
        window.location.href = 'ProductList.html';
    });

    // Event listener for "Checkout" button
    $('#checkoutBtn').click(function() {
        openModal();
    });

    // Event listener for checkout form submission
    $('#checkoutForm').submit(function(event) {
        event.preventDefault();
        placeOrder();
    });

    // Function to open the modal
    function openModal() {
        $('#myModal').css('display', 'block');
    }

    // Function to close the modal
    $('.close').click(function() {
        $('#myModal').css('display', 'none');
    });

    // Function to load cart items
    function loadCartItems() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/cart/get',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function(response) {
                displayCartItems(response);
                calculateTotalPrice(response);
            },
            error: function(xhr) {
                alert('Failed to load cart items: ' + xhr.responseText);
            }
        });
    }

    // Function to display cart items
    function displayCartItems(cartItems) {
        var cartItemsDiv = $('#cartItems');
        cartItemsDiv.empty();
        cartItems.forEach(function(cartItem) {
            var cartItemDiv = $('<div>').addClass('cart-item');

            var productImage = $('<img>').attr('src', cartItem.photo).attr('alt', cartItem.productName).addClass('product-image');
            var productDetails = $('<div>').addClass('product-details');
            var productName = $('<h3>').text(cartItem.productName);
            var productPrice = $('<p>').text('Price: $' + cartItem.price);
            var productQuantity = $('<p>').text('Quantity: ' + cartItem.quantity);
            var productTotal = $('<p>').text('Total Price: $' + (cartItem.price * cartItem.quantity).toFixed(2));

            var removeBtn = $('<button>').text('Remove').addClass('btn remove-btn');
            removeBtn.click(function() {
                removeCartItem(cartItem.id);
            });

            productDetails.append(productName, productPrice, productQuantity, productTotal);
            cartItemDiv.append(productImage, productDetails, removeBtn);
            cartItemsDiv.append(cartItemDiv);
        });
    }

    // Function to calculate total price
    function calculateTotalPrice(cartItems) {
        var totalPrice = 0;
        cartItems.forEach(function(cartItem) {
            totalPrice += cartItem.price * cartItem.quantity;
        });
        $('#totalPrice').text('$' + totalPrice.toFixed(2));
    }

    // Function to remove cart item
    function removeCartItem(itemId) {
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:8080/api/cart/remove/' + itemId,
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function() {
                alert('Item removed from cart');
                loadCartItems();
            },
            error: function(xhr) {
                alert('Failed to remove item from cart: ' + xhr.responseText);
            }
        });
    }

    // Function to place order
    function placeOrder() {
        var fullName = $('#fullName').val();
        var address = $('#address').val();
        var phoneNumber = $('#phoneNumber').val();

        var orderData = {
            fullName: fullName,
            address: address,
            phoneNumber: phoneNumber
        };

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/orders/create',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            data: orderData,
            success: function() {
                alert('Order placed successfully');
                clearCart();
                $('#myModal').css('display', 'none');
            },
            error: function(xhr) {
                alert('Failed to place order: ' + xhr.responseText);
            }
        });
    }

    // Function to clear cart
    function clearCart() {
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:8080/api/cart/clear',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            success: function() {
                alert('Cart cleared');
                loadCartItems();
            },
            error: function(xhr) {
                alert('Failed to clear cart: ' + xhr.responseText);
            }
        });
    }
});

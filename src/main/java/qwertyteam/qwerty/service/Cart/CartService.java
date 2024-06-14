package qwertyteam.qwerty.service.Cart;

import qwertyteam.qwerty.dto.CartItemDTO;
import qwertyteam.qwerty.entity.CartItem;
import qwertyteam.qwerty.entity.Order;
import qwertyteam.qwerty.entity.OrderItem;
import qwertyteam.qwerty.entity.Product;
import qwertyteam.qwerty.entity.User;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public interface CartService {
    CartItem addProductToCart(User user, Product product, int quantity);
    List<CartItemDTO> getCartItems(User user);
    void removeItemFromCart(User user, Long itemId);
    void removeAllItemsFromCart(User user);
}

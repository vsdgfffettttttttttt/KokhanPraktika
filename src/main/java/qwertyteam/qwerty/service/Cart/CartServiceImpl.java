package qwertyteam.qwerty.service.Cart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import qwertyteam.qwerty.dto.CartItemDTO;
import qwertyteam.qwerty.entity.CartItem;
import qwertyteam.qwerty.entity.Product;
import qwertyteam.qwerty.entity.User;
import qwertyteam.qwerty.repository.CartItemRepository;
import qwertyteam.qwerty.repository.OrderRepository;
import qwertyteam.qwerty.service.Product.ProductService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductService productService;

    @Override
    public CartItem addProductToCart(User user, Product product, int quantity) {
        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    @Override
    public List<CartItemDTO> getCartItems(User user) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        return cartItems.stream().map(this::convertToCartItemDTO).collect(Collectors.toList());
    }

    @Override
    public void removeItemFromCart(User user, Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    @Override
    public void removeAllItemsFromCart(User user) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        cartItemRepository.deleteAll(cartItems);
    }

    private CartItemDTO convertToCartItemDTO(CartItem cartItem) {
        CartItemDTO cartItemDTO = new CartItemDTO(
                cartItem.getId(),
                cartItem.getProduct().getId(),
                cartItem.getProduct().getName(),
                cartItem.getProduct().getPhoto(),
                cartItem.getQuantity(),
                cartItem.getProduct().getPrice()
        );
        return cartItemDTO;
    }
}

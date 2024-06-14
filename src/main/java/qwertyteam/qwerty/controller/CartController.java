package qwertyteam.qwerty.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import qwertyteam.qwerty.dto.CartItemDTO;
import qwertyteam.qwerty.entity.Product;
import qwertyteam.qwerty.entity.User;
import qwertyteam.qwerty.service.Product.ProductService;
import qwertyteam.qwerty.service.Cart.CartService;
import qwertyteam.qwerty.service.jwt.CustomUserDetails;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    @PostMapping("/add/{productId}")
    public ResponseEntity<String> addToCart(@PathVariable Long productId, @RequestParam int quantity) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = new User();
            user.setId(userDetails.getId());
            Product product = productService.getProductById(productId);
            if (product != null) {
                cartService.addProductToCart(user, product, quantity);
                return ResponseEntity.ok("Product added to cart successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<CartItemDTO>> getCartItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = new User();
            user.setId(userDetails.getId());
            List<CartItemDTO> cartItems = cartService.getCartItems(user);
            return ResponseEntity.ok(cartItems);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<String> removeItemFromCart(@PathVariable Long itemId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = new User();
            user.setId(userDetails.getId());
            cartService.removeItemFromCart(user, itemId);
            return ResponseEntity.ok("Item removed from cart successfully");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = new User();
            user.setId(userDetails.getId());
            cartService.removeAllItemsFromCart(user);
            return ResponseEntity.ok("Cart cleared successfully");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
    }

}
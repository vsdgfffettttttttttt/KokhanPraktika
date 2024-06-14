package qwertyteam.qwerty.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import qwertyteam.qwerty.dto.OrderDTO;
import qwertyteam.qwerty.entity.Order;
import qwertyteam.qwerty.entity.User;
import qwertyteam.qwerty.enumm.OrderStatus;
import qwertyteam.qwerty.service.Order.OrderService;
import qwertyteam.qwerty.service.User.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<List<OrderDTO>> getAllOrders(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            List<OrderDTO> orders = orderService.getAllOrders();
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }


    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestParam String fullName,
                                         @RequestParam String address,
                                         @RequestParam String phoneNumber,
                                         Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            User user = userService.getUserByEmail(authentication.getName());
            Order order = orderService.createOrder(user, fullName, address, phoneNumber);
            return new ResponseEntity<>(order.getId(), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderDTO>> getUserOrders(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            User user = userService.getUserByEmail(authentication.getName());
            List<OrderDTO> orders = orderService.getUserOrders(user);
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId,
                                               @RequestParam OrderStatus newStatus) {
        orderService.updateOrderStatus(orderId, newStatus);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/delete/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        OrderDTO orderDTO = orderService.getOrderById(orderId);
        return ResponseEntity.ok(orderDTO);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getUserOrdersById(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.getUserOrdersById(userId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

}
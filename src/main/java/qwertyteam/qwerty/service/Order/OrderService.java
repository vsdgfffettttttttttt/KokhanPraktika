package qwertyteam.qwerty.service.Order;

import qwertyteam.qwerty.dto.OrderDTO;
import qwertyteam.qwerty.entity.Order;
import qwertyteam.qwerty.entity.User;
import qwertyteam.qwerty.enumm.OrderStatus;

import java.util.List;

public interface OrderService {
    Order createOrder(User user, String fullName, String address, String phoneNumber);
    List<OrderDTO> getUserOrders(User user);

    void updateOrderStatus(Long orderId, OrderStatus newStatus);

    void deleteOrder(Long orderId);

    OrderDTO getOrderById(Long orderId);

    List<OrderDTO> getUserOrdersById(Long userId);

    List<OrderDTO> getAllOrders();
}
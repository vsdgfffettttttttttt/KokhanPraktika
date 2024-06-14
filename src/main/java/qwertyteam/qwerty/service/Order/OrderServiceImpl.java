package qwertyteam.qwerty.service.Order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import qwertyteam.qwerty.dto.OrderDTO;
import qwertyteam.qwerty.dto.OrderItemDTO;
import qwertyteam.qwerty.entity.CartItem;
import qwertyteam.qwerty.entity.Order;
import qwertyteam.qwerty.entity.OrderItem;
import qwertyteam.qwerty.entity.User;
import qwertyteam.qwerty.enumm.OrderStatus;
import qwertyteam.qwerty.repository.CartItemRepository;
import qwertyteam.qwerty.repository.OrderItemRepository;
import qwertyteam.qwerty.repository.OrderRepository;
import qwertyteam.qwerty.repository.UserRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(this::convertToOrderDTO).collect(Collectors.toList());
    }

    @Override
    public Order createOrder(User user, String fullName, String address, String phoneNumber) {
        // Получаем все товары в корзине текущего пользователя
        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        // Вычисляем общую стоимость заказа
        double totalPrice = calculateTotalPrice(cartItems);

        // Создаем новый заказ
        Order order = new Order();
        order.setUser(user);
        order.setFullName(fullName);
        order.setAddress(address);
        order.setPhoneNumber(phoneNumber);
        order.setTotalPrice(totalPrice);
        order.setOrderDate(new Date()); // Установка текущей даты

        // Сохраняем заказ в базу данных
        Order savedOrder = orderRepository.save(order);

        // Переносим товары из корзины пользователя в заказ
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice()); // Устанавливаем цену товара
            orderItems.add(orderItem); // Добавляем товар в список
        }
        orderItemRepository.saveAll(orderItems); // Сохраняем все товары

        // Очищаем корзину пользователя
        cartItemRepository.deleteAll(cartItems);

        return savedOrder;
    }

    // Метод для вычисления общей стоимости заказа
    private double calculateTotalPrice(List<CartItem> cartItems) {
        double totalPrice = 0;
        for (CartItem cartItem : cartItems) {
            totalPrice += cartItem.getProduct().getPrice() * cartItem.getQuantity();
        }
        return totalPrice;
    }

    @Override
    public List<OrderDTO> getUserOrders(User user) {
        // Получаем все заказы пользователя
        List<Order> userOrders = orderRepository.findByUser(user);

        // Конвертируем список заказов в список OrderDTO
        List<OrderDTO> orderDTOs = userOrders.stream().map(this::convertToOrderDTO).collect(Collectors.toList());

        return orderDTOs;
    }

    // Метод для конвертации Order в OrderDTO
    private OrderDTO convertToOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setUserId(order.getUser().getId()); // Устанавливаем ID пользователя
        orderDTO.setFullName(order.getFullName());
        orderDTO.setAddress(order.getAddress());
        orderDTO.setPhoneNumber(order.getPhoneNumber());
        orderDTO.setTotalPrice(order.getTotalPrice());
        orderDTO.setStatus(order.getStatus());
        orderDTO.setOrderDate(order.getOrderDate());

        // Получаем список товаров в заказе и конвертируем их в OrderItemDTO
        List<OrderItemDTO> orderItemDTOs = order.getOrderItems().stream()
                .map(orderItem -> {
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setProductId(orderItem.getProduct().getId());
                    itemDTO.setQuantity(orderItem.getQuantity());
                    itemDTO.setProductName(orderItem.getProduct().getName());
                    return itemDTO;
                }).collect(Collectors.toList());
        orderDTO.setOrderItems(orderItemDTOs);

        return orderDTO;
    }

    @Override
    public void updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setStatus(newStatus);
            orderRepository.save(order);
        } else {
            throw new RuntimeException("Order not found with id: " + orderId);
        }
    }

    @Override
    public void deleteOrder(Long orderId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            orderRepository.delete(optionalOrder.get());
        } else {
            throw new RuntimeException("Order not found with id: " + orderId);
        }
    }

    @Override
    public OrderDTO getOrderById(Long orderId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            return convertToOrderDTO(optionalOrder.get());
        } else {
            throw new RuntimeException("Order not found with id: " + orderId);
        }
    }

    @Override
    public List<OrderDTO> getUserOrdersById(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Order> userOrders = orderRepository.findByUser(user);
            return userOrders.stream().map(this::convertToOrderDTO).collect(Collectors.toList());
        } else {
            throw new RuntimeException("User not found with id: " + userId);
        }
    }
}
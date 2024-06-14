package qwertyteam.qwerty.dto;

import lombok.Getter;
import lombok.Setter;
import qwertyteam.qwerty.enumm.OrderStatus;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class OrderDTO {

    private Long id;
    private Long userId; // Добавляем ID пользователя
    private String fullName;
    private String address;
    private String phoneNumber;
    private double totalPrice;
    private OrderStatus status;
    private Date orderDate;
    private List<OrderItemDTO> orderItems; // Список товаров в заказе

    // Геттеры и сеттеры
    // ...

}

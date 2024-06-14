package qwertyteam.qwerty.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemDTO {

    private Long productId;
    private String productName; // Добавим поле для названия продукта
    private int quantity;

    // Геттеры и сеттеры

}

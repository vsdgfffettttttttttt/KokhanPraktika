package qwertyteam.qwerty.dto;

import lombok.Data;
import qwertyteam.qwerty.enumm.ProductType;

@Data
public class ProductDTO {

    private String photo;

    private String name;

    private String description;

    private double price;

    private int quantity;

    private ProductType type;

    // геттеры, сеттеры и другие методы
}

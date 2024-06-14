package qwertyteam.qwerty.dto;

public class CartItemDTO {

    private Long id;
    private Long productId;
    private String productName;
    private String photo; // Добавлено поле photo
    private int quantity;
    private double price;

    // Конструктор
    public CartItemDTO(Long id, Long productId, String productName, String photo, int quantity, double price) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.photo = photo;
        this.quantity = quantity;
        this.price = price;
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
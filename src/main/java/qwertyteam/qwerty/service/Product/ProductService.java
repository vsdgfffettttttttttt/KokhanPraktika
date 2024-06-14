package qwertyteam.qwerty.service.Product;

import qwertyteam.qwerty.dto.ProductDTO;
import qwertyteam.qwerty.entity.Product;
import qwertyteam.qwerty.enumm.ProductType;

import java.util.List;

public interface ProductService {
    Product addProduct(ProductDTO productDTO);
    List<Product> getAllProducts();
    Product getProductById(Long id);
    void deleteProduct(Long id);
    void updateProductQuantity(Long id, int newQuantity);
    void updateProductType(Long id, ProductType newType);
    // Другие методы для управления товарами могут быть добавлены по необходимости
    List<Product> getProductsByType(ProductType type);

}

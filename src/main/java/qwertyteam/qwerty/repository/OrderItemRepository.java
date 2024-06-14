package qwertyteam.qwerty.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import qwertyteam.qwerty.entity.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Здесь можно добавить дополнительные методы для работы с элементами заказа, если нужно
}

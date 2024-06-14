package qwertyteam.qwerty.service.User;

import qwertyteam.qwerty.entity.User;

import java.util.List;

public interface UserService {
    User getUserByEmail(String email);
    User getUserById(Long userId);
    List<User> getAllUsers();
}
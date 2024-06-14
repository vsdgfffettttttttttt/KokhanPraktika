package qwertyteam.qwerty.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import qwertyteam.qwerty.dto.UserDTO;
import qwertyteam.qwerty.entity.User;
import qwertyteam.qwerty.enumm.Role;
import qwertyteam.qwerty.repository.UserRepository;
import qwertyteam.qwerty.service.User.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class   AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream().map(UserDTO::fromUser).collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        if (user != null) {
            UserDTO userDTO = UserDTO.fromUser(user);
            return ResponseEntity.ok(userDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/assign-admin-role/{userId}")
    public ResponseEntity<?> assignAdminRole(@PathVariable Long userId) {
        return updateUserRole(userId, Role.ADMIN);
    }

    @PutMapping("/assign-user-role/{userId}")
    public ResponseEntity<?> assignUserRole(@PathVariable Long userId) {
        return updateUserRole(userId, Role.USER);
    }

    @PutMapping("/block-user/{userId}")
    public ResponseEntity<?> blockUser(@PathVariable Long userId) {
        return updateUserRole(userId, Role.BLOCKED);
    }

    private ResponseEntity<?> updateUserRole(Long userId, Role role) {
        // Получаем информацию о текущем аутентифицированном пользователе
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Проверяем роль текущего пользователя
        if (!userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("У вас нет прав доступа для выполнения этого действия");
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setRole(role);
            userRepository.save(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

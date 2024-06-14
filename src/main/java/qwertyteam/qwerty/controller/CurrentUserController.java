package qwertyteam.qwerty.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import qwertyteam.qwerty.dto.UserDTO;
import qwertyteam.qwerty.service.jwt.UserDetailsServiceImpl;

@RestController
public class CurrentUserController {

    private final UserDetailsServiceImpl userDetailsService;

    public CurrentUserController(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @GetMapping("/api/current-user")                                                                                                                                                                                    
    public UserDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            // Получаем UserDetails
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            // Создаем UserDTO на основе UserDetails
            return UserDTO.fromUserDetails(userDetails);
        } else {
            // Возвращаем null или другое значение, если пользователь не авторизован
            return null;
        }
    }
}

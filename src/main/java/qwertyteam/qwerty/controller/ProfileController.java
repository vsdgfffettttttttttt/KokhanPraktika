package qwertyteam.qwerty.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import qwertyteam.qwerty.dto.ChangePasswordDTO;
import qwertyteam.qwerty.dto.UserDTO;
import qwertyteam.qwerty.entity.User;
import qwertyteam.qwerty.repository.UserRepository;
import qwertyteam.qwerty.service.jwt.UserDetailsServiceImpl;

@RestController
@RequestMapping("/api")
public class ProfileController {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @GetMapping("/profile")
    public UserDTO getUserProfile(Authentication authentication) {
        String email = authentication.getName();
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        return UserDTO.fromUserDetails(userDetails);
    }
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findFirstByEmail(email);
        if (passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
            userRepository.save(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный текущий пароль");
        }
    }
}

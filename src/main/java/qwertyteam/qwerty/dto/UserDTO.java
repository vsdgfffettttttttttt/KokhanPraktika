package qwertyteam.qwerty.dto;

import lombok.Data;
import org.springframework.security.core.userdetails.UserDetails;
import qwertyteam.qwerty.entity.User;
import qwertyteam.qwerty.service.jwt.CustomUserDetails;

@Data
public class UserDTO {

    private Long id;
    private String name;
    private String email;
    private String role;

    public static UserDTO fromUser(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole().toString());
        return userDTO;
    }

    public static UserDTO fromUserDetails(UserDetails userDetails) {
        if (userDetails instanceof CustomUserDetails) {
            CustomUserDetails customUserDetails = (CustomUserDetails) userDetails;
            UserDTO userDTO = new UserDTO();
            userDTO.setId(customUserDetails.getId());
            userDTO.setName(customUserDetails.getName());
            userDTO.setEmail(customUserDetails.getUsername());
            userDTO.setRole(customUserDetails.getAuthorities().iterator().next().getAuthority());
            return userDTO;
        } else {
            throw new IllegalArgumentException("UserDetails must be an instance of CustomUserDetails");
        }
    }
}

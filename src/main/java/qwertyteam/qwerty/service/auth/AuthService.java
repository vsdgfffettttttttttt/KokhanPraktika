package qwertyteam.qwerty.service.auth;

import qwertyteam.qwerty.dto.SignupDTO;
import qwertyteam.qwerty.dto.UserDTO;
import qwertyteam.qwerty.entity.User;

import java.security.Principal;

public interface AuthService {
    UserDTO createUser(SignupDTO signupDTO);

}
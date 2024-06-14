package qwertyteam.qwerty.configuration;

import org.springframework.context.annotation.ComponentScan;
import qwertyteam.qwerty.filter.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfiguration {

    @Autowired
    private JwtRequestFilter requestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf().disable()
                .authorizeHttpRequests()
                .requestMatchers("/authenticate", "/sign-up").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN") // Требуем наличие роли "ADMIN" для доступа к /admin/**
                .requestMatchers("/admin/users/**").hasRole("ADMIN")
                .requestMatchers("/admin/assign-admin-role/**").hasRole("ADMIN")
                .requestMatchers("/admin/assign-user-role/**").hasRole("ADMIN")
                .requestMatchers("/admin/block-user/**").hasRole("ADMIN")
                .requestMatchers("/api/**").authenticated()
                .requestMatchers("/api/current-user").hasAnyRole("ADMIN", "USER")
                .requestMatchers("/api/cart/**").hasAnyRole("ADMIN", "USER")
                .requestMatchers("/api/orders/{orderId}/status?newStatus=PAID").hasRole("ADMIN")
                .requestMatchers("/api/orders/{orderId}/status?newStatus=SHIPPED").hasRole("ADMIN")
                .requestMatchers("/api/orders/{orderId}/status?newStatus=DELIVERED").hasRole("ADMIN")
                .requestMatchers("/api/orders/{orderId}/status?newStatus=COMPLETED").hasRole("ADMIN")
                .requestMatchers("/api/orders/delete/{orderId}").hasRole("ADMIN")
                .requestMatchers("/api/orders/orders/{orderId}").hasRole("ADMIN")
                .requestMatchers("/api/orders/orders/user/{userId}").hasRole("ADMIN")
                .requestMatchers("/api/orders/orders/user").hasAnyRole("ADMIN", "USER")
                .requestMatchers("/api/orders/orders/create").hasAnyRole("ADMIN", "USER")
                .requestMatchers("/api/orders/orders/all").hasRole("ADMIN")
                .requestMatchers("/api/products/add").hasRole("ADMIN")
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilterBefore(requestFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}

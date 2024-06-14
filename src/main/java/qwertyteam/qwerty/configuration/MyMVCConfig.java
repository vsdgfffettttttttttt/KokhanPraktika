package qwertyteam.qwerty.configuration;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MyMVCConfig implements WebMvcConfigurer {


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry reg) {
            reg
                    .addResourceHandler("/static.js.css.images/**")
                    .addResourceLocations("classpath:/static.js.css.images/");
    }
}

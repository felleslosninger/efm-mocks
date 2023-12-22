package no.digdir.dpimockc2;

import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    /**
     * Skip timestamp validation because the token used is static.
     */
    @Bean
    public JwtDecoder customDecoder(OAuth2ResourceServerProperties properties) {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri(
                        properties.getJwt().getJwkSetUri())
                .build();
        jwtDecoder.setJwtValidator(p -> OAuth2TokenValidatorResult.success());
        return jwtDecoder;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable();
        http.antMatcher("/api/c2/**")
                .authorizeRequests()
                .antMatchers("/api/c2/**").authenticated()
                .antMatchers("/api/messages").permitAll()
                .antMatchers("/api/messages/**").permitAll()
                .and().oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt);
    }
}

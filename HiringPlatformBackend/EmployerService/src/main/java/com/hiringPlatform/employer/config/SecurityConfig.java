package com.hiringPlatform.employer.config;

import javax.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig   {

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .httpBasic(AbstractHttpConfigurer::disable)
                .cors().configurationSource(corsConfigurationSource())
                .and()
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/getLoggedUser").permitAll()
                .antMatchers("/hasEmployerProfile/{email}").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/addEmployerProfile").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/updateEmployerProfile").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/getProfile/{email}").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/updateAccount").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/getAllJobsForEmployer/{employerId}").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/closeJob/{jobId}").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/addJob").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/getAllStages").permitAll()
                .antMatchers("/getNrJobsForEmployer/{employerId}").hasAnyAuthority("ROLE_EMPLOYER", "ROLE_CANDIDATE")
                .antMatchers("/updateJobDescription").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/getAllApplicationsForJob/{jobId}").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/refuseApplication").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/setNextStage").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/getStagesForJob/{jobId}").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/getAppsPerDayByEmployer/{employerId}").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/getAppsPerJobByEmployer/{employerId}").hasAnyAuthority("ROLE_EMPLOYER")
                .antMatchers("/getAppsStatusNumbers/{employerId}").hasAnyAuthority("ROLE_EMPLOYER")
                .anyRequest().authenticated()
                .and()
                .exceptionHandling().authenticationEntryPoint(accessDeniedHandler())
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization","Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", new CorsConfiguration().applyPermitDefaultValues());

        return source;
    }

    @Bean
    public AuthenticationEntryPoint accessDeniedHandler() {
        return (request, response, authException) -> {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, HttpStatus.UNAUTHORIZED.getReasonPhrase());
        };
    }
}
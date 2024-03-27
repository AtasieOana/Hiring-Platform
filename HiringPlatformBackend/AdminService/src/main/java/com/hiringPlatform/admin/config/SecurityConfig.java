package com.hiringPlatform.admin.config;

import javax.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
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
                .antMatchers("/getUserList").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/editAdmin").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/addAdmin").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/deleteAdmin/{newCreatorEmail}/{adminEmailToBeDeleted}").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/getAllComplaints").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/addComplaint").permitAll()
                .antMatchers("/updateComplaintStatus").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/getJobCategoryDistribution").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/getApplicationStatusPercentage").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/getAccountCreationTrend").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/getTopEmployersWithApplications").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/getJobsExperiencePercentage").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/getApplicationsPerDate").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/getAdminList").permitAll()
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
        return (request, response, authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED, HttpStatus.UNAUTHORIZED.getReasonPhrase());
    }
}
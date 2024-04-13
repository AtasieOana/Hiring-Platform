package com.hiringPlatform.candidate.config;

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
                .antMatchers("/getLoggedUser").permitAll()
                .antMatchers("/updateAccount").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/getCvListForCandidate/{candidateId}").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/addCV").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/getAllJobs").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/getNrJobsForEmployer/{employerId}").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/getAllApplicationsForCandidate/{candidateId}").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/applyToJob").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/refuseApplication").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/checkApplication/{candidateId}/{jobId}").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/addAnswersForQuestions").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/deleteCv/{cvId}").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/getRecommendedJobs/{candidateId}").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/getJobsPublishedPerDay").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/getApplicationStatusNumbers/{candidateId}").hasAnyAuthority("ROLE_CANDIDATE")
                .antMatchers("/getApplicationViewedNumbers/{candidateId}").hasAnyAuthority("ROLE_CANDIDATE")
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
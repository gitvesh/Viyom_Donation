package viyom.donation.viyom.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.List;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import viyom.donation.viyom.Service.JwtService;

import java.io.IOException;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, @Qualifier("securityUserDetailsService") UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain)
            throws ServletException, IOException {
        final String requestURI = request.getRequestURI();
        log.debug("Processing request: {} {}", request.getMethod(), requestURI);

        // Skip JWT check for public endpoints
        if (isPublicEndpoint(requestURI)) {
            log.debug("Skipping JWT check for public endpoint: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = parseJwt(request);
            if (jwt == null) {
                log.debug("No JWT token found in request");
                filterChain.doFilter(request, response);
                return;
            }

            if (!jwtService.isTokenValid(jwt)) {
                log.warn("Invalid JWT token");
                filterChain.doFilter(request, response);
                return;
            }

            String username = jwtService.extractUsername(jwt);
            if (username == null) {
                log.warn("No username found in JWT token");
                filterChain.doFilter(request, response);
                return;
            }

            // Load user details and create authentication
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            String role = jwtService.extractRole(jwt);
            
            // Ensure role has ROLE_ prefix for Spring Security
            String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
            
            // Create authorities list
            List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority(roleWithPrefix)
            );
            
            // Create and set authentication
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                authorities
            );
            
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            log.debug("Successfully authenticated user: {} with roles: {}", username, authorities);
            
        } catch (Exception e) {
            log.error("Authentication error for request {}: {}", requestURI, e.getMessage(), e);
            // Continue the filter chain to let the security configuration handle unauthorized access
        }

        // Always continue the filter chain
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader(AUTH_HEADER);
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith(BEARER_PREFIX)) {
            return headerAuth.substring(BEARER_PREFIX.length());
        }
        return null;
    }

    private boolean isPublicEndpoint(String requestURI) {
        // Remove context path if present
        String path = requestURI.replaceFirst("^/viyom", "");

        // Log the path being checked (for debugging)
        log.debug("Checking if path is public: {}", path);

        boolean isPublic = PATH_MATCHER.match("/api/auth/**", path) ||
                PATH_MATCHER.match("/v3/api-docs/**", path) ||
                PATH_MATCHER.match("/swagger-ui/**", path) ||
                PATH_MATCHER.match("/swagger-ui.html", path) ||
                PATH_MATCHER.match("/swagger-resources/**", path) ||
                PATH_MATCHER.match("/webjars/**", path);

        log.debug("Path {} is public: {}", path, isPublic);
        return isPublic;
    }
}

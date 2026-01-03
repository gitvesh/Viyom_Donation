package viyom.donation.viyom.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import viyom.donation.viyom.Service.JwtService;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();
    
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) 
            throws ServletException, IOException {
        
        log.debug("Processing request to: {}", request.getRequestURI());
        
        String requestURI = request.getRequestURI();
        
        // Skip JWT check for public endpoints
        if (isPublicEndpoint(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtService.isTokenValid(jwt)) {
                String username = jwtService.extractUsername(jwt);
                String role = jwtService.extractRole(jwt);
                
                // Validate role format
                if (!role.startsWith("ROLE_")) {
                    role = "ROLE_" + role;
                }

                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        List.of(new SimpleGrantedAuthority(role))
                    );
                
                authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
            // Continue with the filter chain to let the security configuration handle the unauthorized request
        }

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

package viyom.donation.viyom.Security;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import viyom.donation.viyom.Entity.Admin;

import java.util.Collection;
import java.util.Collections;

@Data
@AllArgsConstructor
public class AdminAuthenticationToken extends org.springframework.security.authentication.AbstractAuthenticationToken {

    private final Admin admin;

    public AdminAuthenticationToken(Admin admin) {
        super(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + admin.getRole())));
        this.admin = admin;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return super.getAuthorities();
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return admin;
    }

    @Override
    public boolean isAuthenticated() {
        return true;
    }

    @Override
    public String getName() {
        return admin.getEmail();
    }
}

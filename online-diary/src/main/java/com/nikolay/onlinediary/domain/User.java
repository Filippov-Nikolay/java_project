package com.nikolay.onlinediary.domain;

import com.nikolay.onlinediary.domain.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "\"Users\"")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"subjects", "group"})
@EqualsAndHashCode(exclude = {"subjects", "group"})
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Логін не може бути порожнім")
    @Size(min = 3, max = 50, message = "Логін має бути від 3 до 50 символів")
    @Column(name = "\"login\"", unique = true, nullable = false)
    private String login;

    @Email(message = "Некоректний формат email")
    @NotBlank(message = "Email обов'язковий")
    @Column(name = "\"email\"")
    private String email;

    @Column(name = "\"password_hash\"", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"role\"")
    private Role role;

    @NotBlank(message = "Ім'я обов'язкове")
    @Column(name = "\"first_name\"")
    private String firstName;

    @NotBlank(message = "Прізвище обов'язкове")
    @Column(name = "\"last_name\"")
    private String lastName;

    @Lob
    @Column(name = "\"avatar\"")
    private byte[] avatar;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "\"group_id\"")
    private Group group;

    @Builder.Default
    @Column(name = "\"enabled\"")
    private boolean enabled = true;

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "\"Teacher_Subjects\"",
            joinColumns = @JoinColumn(name = "\"teacher_id\""),
            inverseJoinColumns = @JoinColumn(name = "\"subject_id\"")
    )
    private Set<Subject> subjects = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override public String getPassword() { return password; }
    @Override public String getUsername() { return login; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return enabled; }
}
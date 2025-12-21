package cl.duoc.laboratorio.user_service.service;

import cl.duoc.laboratorio.user_service.dto.LoginRequestDTO;
import cl.duoc.laboratorio.user_service.dto.LoginResponseDTO;
import cl.duoc.laboratorio.user_service.dto.RoleDTO;
import cl.duoc.laboratorio.user_service.dto.UserRequestDTO;
import cl.duoc.laboratorio.user_service.dto.UserResponseDTO;
import cl.duoc.laboratorio.user_service.exception.ResourceNotFoundException;
import cl.duoc.laboratorio.user_service.model.Role;
import cl.duoc.laboratorio.user_service.model.User;
import cl.duoc.laboratorio.user_service.repository.RoleRepository;
import cl.duoc.laboratorio.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponseDTO createUser(UserRequestDTO requestDTO) {
        if (userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con el email: " + requestDTO.getEmail());
        }

        User user = new User();
        user.setEmail(requestDTO.getEmail());
        user.setPasswordHash(hashPassword(requestDTO.getPassword()));
        // Combinar nombre y apellido en fullName
        user.setFullName(requestDTO.getNombre() + " " + requestDTO.getApellido());

        // Mapear rol string a Role entity
        if (requestDTO.getRol() != null && !requestDTO.getRol().isEmpty()) {
            Role role = roleRepository.findByName(requestDTO.getRol())
                .orElseGet(() -> {
                    // Si no existe el rol, crear uno por defecto (PACIENTE)
                    return roleRepository.findByName("PACIENTE")
                        .orElseThrow(() -> new ResourceNotFoundException("Rol PACIENTE no encontrado"));
                });
            Set<Role> roles = new HashSet<>();
            roles.add(role);
            user.setRoles(roles);
        }

        User savedUser = userRepository.save(user);
        return mapToResponseDTO(savedUser);
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
            .map(this::mapToResponseDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        return mapToResponseDTO(user);
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO requestDTO) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        if (!user.getEmail().equals(requestDTO.getEmail()) &&
            userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con el email: " + requestDTO.getEmail());
        }

        user.setEmail(requestDTO.getEmail());
        if (requestDTO.getPassword() != null && !requestDTO.getPassword().isEmpty()) {
            user.setPasswordHash(hashPassword(requestDTO.getPassword()));
        }
        // Combinar nombre y apellido en fullName
        user.setFullName(requestDTO.getNombre() + " " + requestDTO.getApellido());

        // Mapear rol string a Role entity
        if (requestDTO.getRol() != null && !requestDTO.getRol().isEmpty()) {
            Role role = roleRepository.findByName(requestDTO.getRol())
                .orElseGet(() -> {
                    return roleRepository.findByName("PACIENTE")
                        .orElseThrow(() -> new ResourceNotFoundException("Rol PACIENTE no encontrado"));
                });
            Set<Role> roles = new HashSet<>();
            roles.add(role);
            user.setRoles(roles);
        }

        User updatedUser = userRepository.save(user);
        return mapToResponseDTO(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado con id: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserResponseDTO mapToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());

        // Separar fullName en nombre y apellido
        String[] nombrePartes = user.getFullName().split(" ", 2);
        dto.setNombre(nombrePartes.length > 0 ? nombrePartes[0] : "");
        dto.setApellido(nombrePartes.length > 1 ? nombrePartes[1] : "");

        // Obtener el primer rol como string
        dto.setRol(user.getRoles().stream()
            .findFirst()
            .map(Role::getName)
            .orElse("PACIENTE"));

        return dto;
    }

    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("Credenciales inválidas"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        LoginResponseDTO response = new LoginResponseDTO();
        response.setId(user.getId());
        response.setEmail(user.getEmail());

        // Separar fullName en nombre y apellido
        String[] nombrePartes = user.getFullName().split(" ", 2);
        response.setNombre(nombrePartes.length > 0 ? nombrePartes[0] : "");
        response.setApellido(nombrePartes.length > 1 ? nombrePartes[1] : "");

        // Obtener el primer rol como string
        response.setRol(user.getRoles().stream()
            .findFirst()
            .map(Role::getName)
            .orElse("PACIENTE"));

        response.setMessage("Inicio de sesión exitoso");

        return response;
    }

    private String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }
}

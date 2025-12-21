package cl.duoc.laboratorio.user_service.service;

import cl.duoc.laboratorio.user_service.dto.LoginRequestDTO;
import cl.duoc.laboratorio.user_service.dto.LoginResponseDTO;
import cl.duoc.laboratorio.user_service.dto.UserRequestDTO;
import cl.duoc.laboratorio.user_service.dto.UserResponseDTO;
import cl.duoc.laboratorio.user_service.exception.ResourceNotFoundException;
import cl.duoc.laboratorio.user_service.model.Role;
import cl.duoc.laboratorio.user_service.model.User;
import cl.duoc.laboratorio.user_service.repository.RoleRepository;
import cl.duoc.laboratorio.user_service.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para UserService
 * Cobertura: CRUD completo + Login + Validaciones
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private Role testRole;
    private UserRequestDTO userRequestDTO;

    @BeforeEach
    void setUp() {
        // Setup test role
        testRole = new Role();
        testRole.setId(1L);
        testRole.setName("MEDICO");

        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setPasswordHash("hashedPassword123");
        testUser.setFullName("Test User");
        Set<Role> roles = new HashSet<>();
        roles.add(testRole);
        testUser.setRoles(roles);

        // Setup request DTO
        userRequestDTO = new UserRequestDTO();
        userRequestDTO.setEmail("test@example.com");
        userRequestDTO.setPassword("password123");
        userRequestDTO.setNombre("Test");
        userRequestDTO.setApellido("User");
        userRequestDTO.setRol("MEDICO");
    }

    @Test
    @DisplayName("Crear usuario - Exitoso")
    void testCreateUser_Success() {
        // Given
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findByName("MEDICO")).thenReturn(Optional.of(testRole));
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword123");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        UserResponseDTO result = userService.createUser(userRequestDTO);

        // Then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        assertEquals("Test", result.getNombre());
        assertEquals("User", result.getApellido());
        assertEquals("MEDICO", result.getRol());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Crear usuario - Email duplicado")
    void testCreateUser_EmailAlreadyExists() {
        // Given
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> userService.createUser(userRequestDTO)
        );
        assertTrue(exception.getMessage().contains("Ya existe un usuario con el email"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Crear usuario - Rol no encontrado")
    void testCreateUser_RoleNotFound() {
        // Given
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findByName("MEDICO")).thenReturn(Optional.empty());
        when(roleRepository.findByName("PACIENTE")).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> userService.createUser(userRequestDTO)
        );
        assertTrue(exception.getMessage().contains("Rol PACIENTE no encontrado"));
    }

    @Test
    @DisplayName("Obtener usuario por ID - Exitoso")
    void testGetUserById_Success() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // When
        UserResponseDTO result = userService.getUserById(1L);

        // Then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        assertEquals("Test", result.getNombre());
        assertEquals("User", result.getApellido());
        assertEquals("MEDICO", result.getRol());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Obtener usuario por ID - No encontrado")
    void testGetUserById_NotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> userService.getUserById(1L)
        );
        assertTrue(exception.getMessage().contains("Usuario no encontrado"));
    }

    @Test
    @DisplayName("Actualizar usuario - Exitoso")
    void testUpdateUser_Success() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roleRepository.findByName("MEDICO")).thenReturn(Optional.of(testRole));
        when(passwordEncoder.encode(anyString())).thenReturn("newHashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        UserResponseDTO result = userService.updateUser(1L, userRequestDTO);

        // Then
        assertNotNull(result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Actualizar usuario - No encontrado")
    void testUpdateUser_NotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> userService.updateUser(1L, userRequestDTO)
        );
        assertTrue(exception.getMessage().contains("Usuario no encontrado"));
    }

    @Test
    @DisplayName("Actualizar usuario - Email duplicado")
    void testUpdateUser_EmailAlreadyExists() {
        // Given
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setEmail("old@example.com");
        existingUser.setFullName("Old Name");

        UserRequestDTO updateDTO = new UserRequestDTO();
        updateDTO.setEmail("new@example.com");
        updateDTO.setPassword("password");
        updateDTO.setNombre("New");
        updateDTO.setApellido("Name");
        updateDTO.setRol("MEDICO");

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.existsByEmail("new@example.com")).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> userService.updateUser(1L, updateDTO)
        );
        assertTrue(exception.getMessage().contains("Ya existe un usuario con el email"));
    }

    @Test
    @DisplayName("Eliminar usuario - Exitoso")
    void testDeleteUser_Success() {
        // Given
        when(userRepository.existsById(1L)).thenReturn(true);
        doNothing().when(userRepository).deleteById(1L);

        // When
        userService.deleteUser(1L);

        // Then
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Eliminar usuario - No encontrado")
    void testDeleteUser_NotFound() {
        // Given
        when(userRepository.existsById(1L)).thenReturn(false);

        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> userService.deleteUser(1L)
        );
        assertTrue(exception.getMessage().contains("Usuario no encontrado"));
        verify(userRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("Login - Exitoso")
    void testLogin_Success() {
        // Given
        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashedPassword123")).thenReturn(true);

        // When
        LoginResponseDTO result = userService.login(loginRequest);

        // Then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        assertEquals("Test", result.getNombre());
        assertEquals("User", result.getApellido());
        assertEquals("MEDICO", result.getRol());
        assertEquals("Inicio de sesión exitoso", result.getMessage());
    }

    @Test
    @DisplayName("Login - Usuario no encontrado")
    void testLogin_UserNotFound() {
        // Given
        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("notfound@example.com");
        loginRequest.setPassword("password123");

        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> userService.login(loginRequest)
        );
        assertTrue(exception.getMessage().contains("Credenciales inválidas"));
    }

    @Test
    @DisplayName("Login - Contraseña incorrecta")
    void testLogin_WrongPassword() {
        // Given
        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("wrongpassword");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", "hashedPassword123")).thenReturn(false);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> userService.login(loginRequest)
        );
        assertTrue(exception.getMessage().contains("Credenciales inválidas"));
    }

    @Test
    @DisplayName("Crear usuario sin roles")
    void testCreateUser_WithoutRoles() {
        // Given
        UserRequestDTO dtoWithoutRoles = new UserRequestDTO();
        dtoWithoutRoles.setEmail("test@example.com");
        dtoWithoutRoles.setPassword("password123");
        dtoWithoutRoles.setNombre("Test");
        dtoWithoutRoles.setApellido("User");
        dtoWithoutRoles.setRol(null);

        User userWithoutRoles = new User();
        userWithoutRoles.setId(1L);
        userWithoutRoles.setEmail("test@example.com");
        userWithoutRoles.setFullName("Test User");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword123");
        when(userRepository.save(any(User.class))).thenReturn(userWithoutRoles);

        // When
        UserResponseDTO result = userService.createUser(dtoWithoutRoles);

        // Then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    @DisplayName("Actualizar usuario sin cambiar contraseña")
    void testUpdateUser_WithoutPasswordChange() {
        // Given
        UserRequestDTO updateDTO = new UserRequestDTO();
        updateDTO.setEmail("test@example.com");
        updateDTO.setPassword(null);  // No password change
        updateDTO.setNombre("Updated");
        updateDTO.setApellido("Name");
        updateDTO.setRol("MEDICO");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roleRepository.findByName("MEDICO")).thenReturn(Optional.of(testRole));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        UserResponseDTO result = userService.updateUser(1L, updateDTO);

        // Then
        assertNotNull(result);
        verify(passwordEncoder, never()).encode(anyString());
    }
}

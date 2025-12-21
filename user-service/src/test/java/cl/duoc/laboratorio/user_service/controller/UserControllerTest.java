package cl.duoc.laboratorio.user_service.controller;

import cl.duoc.laboratorio.user_service.dto.LoginRequestDTO;
import cl.duoc.laboratorio.user_service.dto.LoginResponseDTO;
import cl.duoc.laboratorio.user_service.dto.UserRequestDTO;
import cl.duoc.laboratorio.user_service.dto.UserResponseDTO;
import cl.duoc.laboratorio.user_service.exception.ResourceNotFoundException;
import cl.duoc.laboratorio.user_service.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests unitarios para UserController
 * Cobertura: REST endpoints + Validaciones HTTP
 */
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    private UserRequestDTO userRequestDTO;
    private UserResponseDTO userResponseDTO;
    private LoginRequestDTO loginRequestDTO;
    private LoginResponseDTO loginResponseDTO;

    @BeforeEach
    void setUp() {
        // Setup request DTO
        userRequestDTO = new UserRequestDTO();
        userRequestDTO.setEmail("test@example.com");
        userRequestDTO.setPassword("password123");
        userRequestDTO.setNombre("Test");
        userRequestDTO.setApellido("User");
        userRequestDTO.setRol("MEDICO");

        // Setup response DTO
        userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(1L);
        userResponseDTO.setEmail("test@example.com");
        userResponseDTO.setNombre("Test");
        userResponseDTO.setApellido("User");
        userResponseDTO.setRol("MEDICO");

        // Setup login DTOs
        loginRequestDTO = new LoginRequestDTO();
        loginRequestDTO.setEmail("test@example.com");
        loginRequestDTO.setPassword("password123");

        loginResponseDTO = new LoginResponseDTO();
        loginResponseDTO.setId(1L);
        loginResponseDTO.setEmail("test@example.com");
        loginResponseDTO.setNombre("Test");
        loginResponseDTO.setApellido("User");
        loginResponseDTO.setRol("MEDICO");
        loginResponseDTO.setMessage("Inicio de sesión exitoso");
    }

    @Test
    @DisplayName("POST /api/users - Crear usuario exitoso")
    void testCreateUser_Success() throws Exception {
        // Given
        when(userService.createUser(any(UserRequestDTO.class))).thenReturn(userResponseDTO);

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.nombre").value("Test"))
                .andExpect(jsonPath("$.apellido").value("User"));

        verify(userService, times(1)).createUser(any(UserRequestDTO.class));
    }

    @Test
    @DisplayName("POST /api/users - Email duplicado (400)")
    void testCreateUser_DuplicateEmail() throws Exception {
        // Given
        when(userService.createUser(any(UserRequestDTO.class)))
            .thenThrow(new IllegalArgumentException("Ya existe un usuario con el email: test@example.com"));

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userRequestDTO)))
                .andExpect(status().isBadRequest());

        verify(userService, times(1)).createUser(any(UserRequestDTO.class));
    }

    @Test
    @DisplayName("GET /api/users/{id} - Obtener usuario exitoso")
    void testGetUserById_Success() throws Exception {
        // Given
        when(userService.getUserById(1L)).thenReturn(userResponseDTO);

        // When & Then
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.nombre").value("Test"))
                .andExpect(jsonPath("$.apellido").value("User"));

        verify(userService, times(1)).getUserById(1L);
    }

    @Test
    @DisplayName("GET /api/users/{id} - Usuario no encontrado (404)")
    void testGetUserById_NotFound() throws Exception {
        // Given
        when(userService.getUserById(999L))
            .thenThrow(new ResourceNotFoundException("Usuario no encontrado con ID: 999"));

        // When & Then
        mockMvc.perform(get("/api/users/999"))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).getUserById(999L);
    }

    @Test
    @DisplayName("PUT /api/users/{id} - Actualizar usuario exitoso")
    void testUpdateUser_Success() throws Exception {
        // Given
        UserResponseDTO updatedResponse = new UserResponseDTO();
        updatedResponse.setId(1L);
        updatedResponse.setEmail("test@example.com");
        updatedResponse.setNombre("Updated");
        updatedResponse.setApellido("User");
        updatedResponse.setRol("MEDICO");

        when(userService.updateUser(eq(1L), any(UserRequestDTO.class))).thenReturn(updatedResponse);

        // When & Then
        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Updated"))
                .andExpect(jsonPath("$.apellido").value("User"));

        verify(userService, times(1)).updateUser(eq(1L), any(UserRequestDTO.class));
    }

    @Test
    @DisplayName("PUT /api/users/{id} - Usuario no encontrado (404)")
    void testUpdateUser_NotFound() throws Exception {
        // Given
        when(userService.updateUser(eq(999L), any(UserRequestDTO.class)))
            .thenThrow(new ResourceNotFoundException("Usuario no encontrado con ID: 999"));

        // When & Then
        mockMvc.perform(put("/api/users/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userRequestDTO)))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).updateUser(eq(999L), any(UserRequestDTO.class));
    }

    @Test
    @DisplayName("DELETE /api/users/{id} - Eliminar usuario exitoso")
    void testDeleteUser_Success() throws Exception {
        // Given
        doNothing().when(userService).deleteUser(1L);

        // When & Then
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Usuario eliminado correctamente"));

        verify(userService, times(1)).deleteUser(1L);
    }

    @Test
    @DisplayName("DELETE /api/users/{id} - Usuario no encontrado (404)")
    void testDeleteUser_NotFound() throws Exception {
        // Given
        doThrow(new ResourceNotFoundException("Usuario no encontrado con ID: 999"))
            .when(userService).deleteUser(999L);

        // When & Then
        mockMvc.perform(delete("/api/users/999"))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).deleteUser(999L);
    }

    @Test
    @DisplayName("POST /api/users/auth/login - Login exitoso")
    void testLogin_Success() throws Exception {
        // Given
        when(userService.login(any(LoginRequestDTO.class))).thenReturn(loginResponseDTO);

        // When & Then
        mockMvc.perform(post("/api/users/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.nombre").value("Test"))
                .andExpect(jsonPath("$.apellido").value("User"));

        verify(userService, times(1)).login(any(LoginRequestDTO.class));
    }

    @Test
    @DisplayName("POST /api/users/auth/login - Credenciales inválidas (400)")
    void testLogin_InvalidCredentials() throws Exception {
        // Given
        when(userService.login(any(LoginRequestDTO.class)))
            .thenThrow(new IllegalArgumentException("Contraseña incorrecta"));

        // When & Then
        mockMvc.perform(post("/api/users/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isBadRequest());

        verify(userService, times(1)).login(any(LoginRequestDTO.class));
    }

    @Test
    @DisplayName("POST /api/users/auth/login - Usuario no encontrado (404)")
    void testLogin_UserNotFound() throws Exception {
        // Given
        when(userService.login(any(LoginRequestDTO.class)))
            .thenThrow(new ResourceNotFoundException("Usuario no encontrado"));

        // When & Then
        mockMvc.perform(post("/api/users/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).login(any(LoginRequestDTO.class));
    }
}

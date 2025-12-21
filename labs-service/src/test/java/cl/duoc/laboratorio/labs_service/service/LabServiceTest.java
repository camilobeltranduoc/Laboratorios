package cl.duoc.laboratorio.labs_service.service;

import cl.duoc.laboratorio.labs_service.dto.LabRequestDTO;
import cl.duoc.laboratorio.labs_service.dto.LabResponseDTO;
import cl.duoc.laboratorio.labs_service.exception.ResourceNotFoundException;
import cl.duoc.laboratorio.labs_service.model.Lab;
import cl.duoc.laboratorio.labs_service.repository.LabRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para LabService
 * Cobertura: CRUD completo + Validaciones
 */
@ExtendWith(MockitoExtension.class)
class LabServiceTest {

    @Mock
    private LabRepository labRepository;

    @InjectMocks
    private LabService labService;

    private Lab testLab;
    private LabRequestDTO labRequestDTO;

    @BeforeEach
    void setUp() {
        // Setup test lab
        testLab = new Lab();
        testLab.setId(1L);
        testLab.setName("Laboratorio Central");

        // Setup request DTO
        labRequestDTO = new LabRequestDTO();
        labRequestDTO.setName("Laboratorio Central");
    }

    @Test
    @DisplayName("Crear laboratorio - Exitoso")
    void testCreateLab_Success() {
        // Given
        when(labRepository.existsByName(anyString())).thenReturn(false);
        when(labRepository.save(any(Lab.class))).thenReturn(testLab);

        // When
        LabResponseDTO result = labService.createLab(labRequestDTO);

        // Then
        assertNotNull(result);
        assertEquals("Laboratorio Central", result.getName());
        assertEquals(1L, result.getId());
        verify(labRepository, times(1)).save(any(Lab.class));
        verify(labRepository, times(1)).existsByName("Laboratorio Central");
    }

    @Test
    @DisplayName("Crear laboratorio - Nombre duplicado")
    void testCreateLab_DuplicateName() {
        // Given
        when(labRepository.existsByName(anyString())).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> labService.createLab(labRequestDTO)
        );
        assertTrue(exception.getMessage().contains("Ya existe un laboratorio con el nombre"));
        verify(labRepository, never()).save(any(Lab.class));
    }

    @Test
    @DisplayName("Obtener laboratorio por ID - Exitoso")
    void testGetLabById_Success() {
        // Given
        when(labRepository.findById(1L)).thenReturn(Optional.of(testLab));

        // When
        LabResponseDTO result = labService.getLabById(1L);

        // Then
        assertNotNull(result);
        assertEquals("Laboratorio Central", result.getName());
        assertEquals(1L, result.getId());
        verify(labRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Obtener laboratorio por ID - No encontrado")
    void testGetLabById_NotFound() {
        // Given
        when(labRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> labService.getLabById(1L)
        );
        assertTrue(exception.getMessage().contains("Laboratorio no encontrado"));
    }

    @Test
    @DisplayName("Obtener todos los laboratorios - Exitoso")
    void testGetAllLabs_Success() {
        // Given
        Lab lab2 = new Lab();
        lab2.setId(2L);
        lab2.setName("Laboratorio Norte");

        List<Lab> labs = Arrays.asList(testLab, lab2);
        when(labRepository.findAll()).thenReturn(labs);

        // When
        List<LabResponseDTO> result = labService.getAllLabs();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Laboratorio Central", result.get(0).getName());
        assertEquals("Laboratorio Norte", result.get(1).getName());
        verify(labRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Obtener todos los laboratorios - Lista vacía")
    void testGetAllLabs_EmptyList() {
        // Given
        when(labRepository.findAll()).thenReturn(Arrays.asList());

        // When
        List<LabResponseDTO> result = labService.getAllLabs();

        // Then
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(labRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Actualizar laboratorio - Exitoso")
    void testUpdateLab_Success() {
        // Given
        LabRequestDTO updateDTO = new LabRequestDTO();
        updateDTO.setName("Laboratorio Actualizado");

        Lab updatedLab = new Lab();
        updatedLab.setId(1L);
        updatedLab.setName("Laboratorio Actualizado");

        when(labRepository.findById(1L)).thenReturn(Optional.of(testLab));
        when(labRepository.existsByName("Laboratorio Actualizado")).thenReturn(false);
        when(labRepository.save(any(Lab.class))).thenReturn(updatedLab);

        // When
        LabResponseDTO result = labService.updateLab(1L, updateDTO);

        // Then
        assertNotNull(result);
        assertEquals("Laboratorio Actualizado", result.getName());
        verify(labRepository, times(1)).save(any(Lab.class));
    }

    @Test
    @DisplayName("Actualizar laboratorio - No encontrado")
    void testUpdateLab_NotFound() {
        // Given
        when(labRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> labService.updateLab(1L, labRequestDTO)
        );
        assertTrue(exception.getMessage().contains("Laboratorio no encontrado"));
        verify(labRepository, never()).save(any(Lab.class));
    }

    @Test
    @DisplayName("Actualizar laboratorio - Nombre duplicado")
    void testUpdateLab_DuplicateName() {
        // Given
        LabRequestDTO updateDTO = new LabRequestDTO();
        updateDTO.setName("Laboratorio Duplicado");

        when(labRepository.findById(1L)).thenReturn(Optional.of(testLab));
        when(labRepository.existsByName("Laboratorio Duplicado")).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> labService.updateLab(1L, updateDTO)
        );
        assertTrue(exception.getMessage().contains("Ya existe un laboratorio con el nombre"));
        verify(labRepository, never()).save(any(Lab.class));
    }

    @Test
    @DisplayName("Actualizar laboratorio - Mismo nombre (sin cambio)")
    void testUpdateLab_SameName() {
        // Given
        when(labRepository.findById(1L)).thenReturn(Optional.of(testLab));
        when(labRepository.existsByName("Laboratorio Central")).thenReturn(true);
        when(labRepository.save(any(Lab.class))).thenReturn(testLab);

        // When
        LabResponseDTO result = labService.updateLab(1L, labRequestDTO);

        // Then
        assertNotNull(result);
        assertEquals("Laboratorio Central", result.getName());
        verify(labRepository, times(1)).save(any(Lab.class));
    }

    @Test
    @DisplayName("Eliminar laboratorio - Exitoso")
    void testDeleteLab_Success() {
        // Given
        when(labRepository.findById(1L)).thenReturn(Optional.of(testLab));
        doNothing().when(labRepository).delete(testLab);

        // When
        labService.deleteLab(1L);

        // Then
        verify(labRepository, times(1)).findById(1L);
        verify(labRepository, times(1)).delete(testLab);
    }

    @Test
    @DisplayName("Eliminar laboratorio - No encontrado")
    void testDeleteLab_NotFound() {
        // Given
        when(labRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> labService.deleteLab(1L)
        );
        assertTrue(exception.getMessage().contains("Laboratorio no encontrado"));
        verify(labRepository, never()).delete(any(Lab.class));
    }
}

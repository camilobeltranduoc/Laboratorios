package cl.duoc.laboratorio.results_service.service;

import cl.duoc.laboratorio.results_service.dto.ResultRequestDTO;
import cl.duoc.laboratorio.results_service.dto.ResultResponseDTO;
import cl.duoc.laboratorio.results_service.exception.ResourceNotFoundException;
import cl.duoc.laboratorio.results_service.model.Lab;
import cl.duoc.laboratorio.results_service.model.Result;
import cl.duoc.laboratorio.results_service.repository.LabRepository;
import cl.duoc.laboratorio.results_service.repository.ResultRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para ResultService
 * Cobertura: CRUD completo + Validaciones + Queries por Usuario
 */
@ExtendWith(MockitoExtension.class)
class ResultServiceTest {

    @Mock
    private ResultRepository resultRepository;

    @Mock
    private LabRepository labRepository;

    @InjectMocks
    private ResultService resultService;

    private Result testResult;
    private Lab testLab;
    private ResultRequestDTO resultRequestDTO;

    @BeforeEach
    void setUp() {
        // Setup test lab
        testLab = new Lab();
        testLab.setId(1L);
        testLab.setName("Laboratorio Central");

        // Setup test result
        testResult = new Result();
        testResult.setId(1L);
        testResult.setUserId(100L);
        testResult.setLabId(1L);
        testResult.setTestType("Hemograma");
        testResult.setValueJson("{\"hemoglobina\": 14.5, \"leucocitos\": 8000}");
        testResult.setStatus("COMPLETADO");
        testResult.setResultDate(LocalDate.of(2024, 1, 15));
        testResult.setLab(testLab);

        // Setup request DTO
        resultRequestDTO = new ResultRequestDTO();
        resultRequestDTO.setUserId(100L);
        resultRequestDTO.setLabId(1L);
        resultRequestDTO.setTestType("Hemograma");
        resultRequestDTO.setValueJson("{\"hemoglobina\": 14.5, \"leucocitos\": 8000}");
        resultRequestDTO.setStatus("COMPLETADO");
        resultRequestDTO.setResultDate(LocalDate.of(2024, 1, 15));
    }

    @Test
    @DisplayName("Crear resultado - Exitoso")
    void testCreateResult_Success() {
        // Given
        when(labRepository.findById(1L)).thenReturn(Optional.of(testLab));
        when(resultRepository.save(any(Result.class))).thenReturn(testResult);

        // When
        ResultResponseDTO result = resultService.createResult(resultRequestDTO);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(100L, result.getUserId());
        assertEquals(1L, result.getLabId());
        assertEquals("Hemograma", result.getTestType());
        assertEquals("COMPLETADO", result.getStatus());
        assertEquals("Laboratorio Central", result.getLabName());
        verify(resultRepository, times(1)).save(any(Result.class));
        verify(labRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Crear resultado - Laboratorio no encontrado")
    void testCreateResult_LabNotFound() {
        // Given
        when(labRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> resultService.createResult(resultRequestDTO)
        );
        assertTrue(exception.getMessage().contains("Laboratorio no encontrado"));
        verify(resultRepository, never()).save(any(Result.class));
    }

    @Test
    @DisplayName("Obtener resultado por ID - Exitoso")
    void testGetResultById_Success() {
        // Given
        when(resultRepository.findById(1L)).thenReturn(Optional.of(testResult));

        // When
        ResultResponseDTO result = resultService.getResultById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(100L, result.getUserId());
        assertEquals("Hemograma", result.getTestType());
        assertEquals("Laboratorio Central", result.getLabName());
        verify(resultRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Obtener resultado por ID - No encontrado")
    void testGetResultById_NotFound() {
        // Given
        when(resultRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> resultService.getResultById(1L)
        );
        assertTrue(exception.getMessage().contains("Resultado no encontrado"));
    }

    @Test
    @DisplayName("Obtener resultados por userId - Exitoso")
    void testGetResultsByUserId_Success() {
        // Given
        Result result2 = new Result();
        result2.setId(2L);
        result2.setUserId(100L);
        result2.setLabId(1L);
        result2.setTestType("Glucosa");
        result2.setValueJson("{\"glucosa\": 95}");
        result2.setStatus("PENDIENTE");
        result2.setResultDate(LocalDate.of(2024, 1, 20));
        result2.setLab(testLab);

        List<Result> results = Arrays.asList(testResult, result2);
        when(resultRepository.findByUserId(100L)).thenReturn(results);

        // When
        List<ResultResponseDTO> resultList = resultService.getResultsByUserId(100L);

        // Then
        assertNotNull(resultList);
        assertEquals(2, resultList.size());
        assertEquals("Hemograma", resultList.get(0).getTestType());
        assertEquals("Glucosa", resultList.get(1).getTestType());
        verify(resultRepository, times(1)).findByUserId(100L);
    }

    @Test
    @DisplayName("Obtener resultados por userId - Lista vacía")
    void testGetResultsByUserId_EmptyList() {
        // Given
        when(resultRepository.findByUserId(100L)).thenReturn(Arrays.asList());

        // When
        List<ResultResponseDTO> resultList = resultService.getResultsByUserId(100L);

        // Then
        assertNotNull(resultList);
        assertEquals(0, resultList.size());
        verify(resultRepository, times(1)).findByUserId(100L);
    }

    @Test
    @DisplayName("Actualizar resultado - Exitoso")
    void testUpdateResult_Success() {
        // Given
        ResultRequestDTO updateDTO = new ResultRequestDTO();
        updateDTO.setUserId(100L);
        updateDTO.setLabId(1L);
        updateDTO.setTestType("Hemograma Completo");
        updateDTO.setValueJson("{\"hemoglobina\": 15.0, \"leucocitos\": 7500}");
        updateDTO.setStatus("REVISADO");
        updateDTO.setResultDate(LocalDate.of(2024, 1, 16));

        Result updatedResult = new Result();
        updatedResult.setId(1L);
        updatedResult.setUserId(100L);
        updatedResult.setLabId(1L);
        updatedResult.setTestType("Hemograma Completo");
        updatedResult.setValueJson("{\"hemoglobina\": 15.0, \"leucocitos\": 7500}");
        updatedResult.setStatus("REVISADO");
        updatedResult.setResultDate(LocalDate.of(2024, 1, 16));
        updatedResult.setLab(testLab);

        when(resultRepository.findById(1L)).thenReturn(Optional.of(testResult));
        when(labRepository.findById(1L)).thenReturn(Optional.of(testLab));
        when(resultRepository.save(any(Result.class))).thenReturn(updatedResult);

        // When
        ResultResponseDTO result = resultService.updateResult(1L, updateDTO);

        // Then
        assertNotNull(result);
        assertEquals("Hemograma Completo", result.getTestType());
        assertEquals("REVISADO", result.getStatus());
        verify(resultRepository, times(1)).save(any(Result.class));
    }

    @Test
    @DisplayName("Actualizar resultado - Resultado no encontrado")
    void testUpdateResult_ResultNotFound() {
        // Given
        when(resultRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> resultService.updateResult(1L, resultRequestDTO)
        );
        assertTrue(exception.getMessage().contains("Resultado no encontrado"));
        verify(resultRepository, never()).save(any(Result.class));
    }

    @Test
    @DisplayName("Actualizar resultado - Laboratorio no encontrado")
    void testUpdateResult_LabNotFound() {
        // Given
        when(resultRepository.findById(1L)).thenReturn(Optional.of(testResult));
        when(labRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> resultService.updateResult(1L, resultRequestDTO)
        );
        assertTrue(exception.getMessage().contains("Laboratorio no encontrado"));
        verify(resultRepository, never()).save(any(Result.class));
    }

    @Test
    @DisplayName("Eliminar resultado - Exitoso")
    void testDeleteResult_Success() {
        // Given
        when(resultRepository.existsById(1L)).thenReturn(true);
        doNothing().when(resultRepository).deleteById(1L);

        // When
        resultService.deleteResult(1L);

        // Then
        verify(resultRepository, times(1)).existsById(1L);
        verify(resultRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Eliminar resultado - No encontrado")
    void testDeleteResult_NotFound() {
        // Given
        when(resultRepository.existsById(1L)).thenReturn(false);

        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> resultService.deleteResult(1L)
        );
        assertTrue(exception.getMessage().contains("Resultado no encontrado"));
        verify(resultRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("Mapear a DTO - Lab nulo")
    void testMapToResponseDTO_NullLab() {
        // Given
        Result resultWithoutLab = new Result();
        resultWithoutLab.setId(1L);
        resultWithoutLab.setUserId(100L);
        resultWithoutLab.setLabId(1L);
        resultWithoutLab.setTestType("Glucosa");
        resultWithoutLab.setValueJson("{\"glucosa\": 90}");
        resultWithoutLab.setStatus("PENDIENTE");
        resultWithoutLab.setResultDate(LocalDate.now());
        resultWithoutLab.setLab(null);

        when(labRepository.findById(1L)).thenReturn(Optional.of(testLab));
        when(resultRepository.save(any(Result.class))).thenReturn(resultWithoutLab);

        ResultRequestDTO dto = new ResultRequestDTO();
        dto.setUserId(100L);
        dto.setLabId(1L);
        dto.setTestType("Glucosa");
        dto.setValueJson("{\"glucosa\": 90}");
        dto.setStatus("PENDIENTE");
        dto.setResultDate(LocalDate.now());

        // When
        ResultResponseDTO result = resultService.createResult(dto);

        // Then
        assertNotNull(result);
        assertNull(result.getLabName());
    }
}

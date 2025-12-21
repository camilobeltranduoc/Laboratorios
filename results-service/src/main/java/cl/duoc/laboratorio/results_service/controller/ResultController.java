package cl.duoc.laboratorio.results_service.controller;

import cl.duoc.laboratorio.results_service.dto.LabDTO;
import cl.duoc.laboratorio.results_service.dto.ResultRequestDTO;
import cl.duoc.laboratorio.results_service.dto.ResultResponseDTO;
import cl.duoc.laboratorio.results_service.service.LabService;
import cl.duoc.laboratorio.results_service.service.ResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;
    private final LabService labService;

    @GetMapping("/labs")
    public ResponseEntity<List<LabDTO>> getAllLabs() {
        List<LabDTO> labs = labService.getAllLabs();
        return ResponseEntity.ok(labs);
    }

    @PostMapping
    public ResponseEntity<ResultResponseDTO> createResult(@Valid @RequestBody ResultRequestDTO requestDTO) {
        ResultResponseDTO createdResult = resultService.createResult(requestDTO);
        return new ResponseEntity<>(createdResult, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ResultResponseDTO>> getAllResults() {
        List<ResultResponseDTO> results = resultService.getAllResults();
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultResponseDTO> getResultById(@PathVariable Long id) {
        ResultResponseDTO result = resultService.getResultById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<ResultResponseDTO>> getResultsByUserId(@PathVariable Long userId) {
        List<ResultResponseDTO> results = resultService.getResultsByUserId(userId);
        return ResponseEntity.ok(results);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultResponseDTO> updateResult(
            @PathVariable Long id,
            @Valid @RequestBody ResultRequestDTO requestDTO) {
        ResultResponseDTO updatedResult = resultService.updateResult(id, requestDTO);
        return ResponseEntity.ok(updatedResult);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteResult(@PathVariable Long id) {
        resultService.deleteResult(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Resultado eliminado correctamente");
        return ResponseEntity.ok(response);
    }
}

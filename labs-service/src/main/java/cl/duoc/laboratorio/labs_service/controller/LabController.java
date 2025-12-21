package cl.duoc.laboratorio.labs_service.controller;

import cl.duoc.laboratorio.labs_service.dto.LabRequestDTO;
import cl.duoc.laboratorio.labs_service.dto.LabResponseDTO;
import cl.duoc.laboratorio.labs_service.service.LabService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labs")
@RequiredArgsConstructor
public class LabController {

    private final LabService labService;

    @PostMapping
    public ResponseEntity<LabResponseDTO> createLab(@Valid @RequestBody LabRequestDTO labRequestDTO) {
        LabResponseDTO created = labService.createLab(labRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabResponseDTO> getLabById(@PathVariable Long id) {
        LabResponseDTO lab = labService.getLabById(id);
        return ResponseEntity.ok(lab);
    }

    @GetMapping
    public ResponseEntity<List<LabResponseDTO>> getAllLabs() {
        List<LabResponseDTO> labs = labService.getAllLabs();
        return ResponseEntity.ok(labs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabResponseDTO> updateLab(@PathVariable Long id,
                                                     @Valid @RequestBody LabRequestDTO labRequestDTO) {
        LabResponseDTO updated = labService.updateLab(id, labRequestDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLab(@PathVariable Long id) {
        labService.deleteLab(id);
        return ResponseEntity.noContent().build();
    }
}

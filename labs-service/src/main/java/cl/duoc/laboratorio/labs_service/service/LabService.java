package cl.duoc.laboratorio.labs_service.service;

import cl.duoc.laboratorio.labs_service.dto.LabRequestDTO;
import cl.duoc.laboratorio.labs_service.dto.LabResponseDTO;
import cl.duoc.laboratorio.labs_service.exception.ResourceNotFoundException;
import cl.duoc.laboratorio.labs_service.model.Lab;
import cl.duoc.laboratorio.labs_service.repository.LabRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LabService {

    private final LabRepository labRepository;

    @Transactional
    public LabResponseDTO createLab(LabRequestDTO labRequestDTO) {
        if (labRepository.existsByName(labRequestDTO.getName())) {
            throw new IllegalArgumentException("Ya existe un laboratorio con el nombre: " + labRequestDTO.getName());
        }

        Lab lab = new Lab();
        lab.setName(labRequestDTO.getName());

        Lab savedLab = labRepository.save(lab);
        return mapToResponseDTO(savedLab);
    }

    @Transactional(readOnly = true)
    public LabResponseDTO getLabById(Long id) {
        Lab lab = labRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laboratorio no encontrado con ID: " + id));
        return mapToResponseDTO(lab);
    }

    @Transactional(readOnly = true)
    public List<LabResponseDTO> getAllLabs() {
        return labRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public LabResponseDTO updateLab(Long id, LabRequestDTO labRequestDTO) {
        Lab lab = labRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laboratorio no encontrado con ID: " + id));

        if (labRepository.existsByName(labRequestDTO.getName()) &&
            !lab.getName().equals(labRequestDTO.getName())) {
            throw new IllegalArgumentException("Ya existe un laboratorio con el nombre: " + labRequestDTO.getName());
        }

        lab.setName(labRequestDTO.getName());
        Lab updatedLab = labRepository.save(lab);
        return mapToResponseDTO(updatedLab);
    }

    @Transactional
    public void deleteLab(Long id) {
        Lab lab = labRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laboratorio no encontrado con ID: " + id));
        labRepository.delete(lab);
    }

    private LabResponseDTO mapToResponseDTO(Lab lab) {
        return new LabResponseDTO(lab.getId(), lab.getName());
    }
}

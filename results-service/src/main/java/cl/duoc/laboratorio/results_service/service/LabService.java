package cl.duoc.laboratorio.results_service.service;

import cl.duoc.laboratorio.results_service.dto.LabDTO;
import cl.duoc.laboratorio.results_service.model.Lab;
import cl.duoc.laboratorio.results_service.repository.LabRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LabService {

    private final LabRepository labRepository;

    @Transactional(readOnly = true)
    public List<LabDTO> getAllLabs() {
        return labRepository.findAll().stream()
            .map(lab -> new LabDTO(lab.getId(), lab.getName()))
            .collect(Collectors.toList());
    }
}

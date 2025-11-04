package cl.duoc.laboratorio.results_service.service;

import cl.duoc.laboratorio.results_service.dto.ResultRequestDTO;
import cl.duoc.laboratorio.results_service.dto.ResultResponseDTO;
import cl.duoc.laboratorio.results_service.exception.ResourceNotFoundException;
import cl.duoc.laboratorio.results_service.model.Lab;
import cl.duoc.laboratorio.results_service.model.Result;
import cl.duoc.laboratorio.results_service.repository.LabRepository;
import cl.duoc.laboratorio.results_service.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;
    private final LabRepository labRepository;

    @Transactional
    public ResultResponseDTO createResult(ResultRequestDTO requestDTO) {
        Lab lab = labRepository.findById(requestDTO.getLabId())
            .orElseThrow(() -> new ResourceNotFoundException("Laboratorio no encontrado con id: " + requestDTO.getLabId()));

        Result result = new Result();
        result.setUserId(requestDTO.getUserId());
        result.setLabId(requestDTO.getLabId());
        result.setTestType(requestDTO.getTestType());
        result.setValueJson(requestDTO.getValueJson());
        result.setStatus(requestDTO.getStatus());
        result.setResultDate(requestDTO.getResultDate());

        Result savedResult = resultRepository.save(result);
        return mapToResponseDTO(savedResult);
    }

    @Transactional(readOnly = true)
    public ResultResponseDTO getResultById(Long id) {
        Result result = resultRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resultado no encontrado con id: " + id));
        return mapToResponseDTO(result);
    }

    @Transactional(readOnly = true)
    public List<ResultResponseDTO> getResultsByUserId(Long userId) {
        List<Result> results = resultRepository.findByUserId(userId);
        return results.stream()
            .map(this::mapToResponseDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public ResultResponseDTO updateResult(Long id, ResultRequestDTO requestDTO) {
        Result result = resultRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resultado no encontrado con id: " + id));

        Lab lab = labRepository.findById(requestDTO.getLabId())
            .orElseThrow(() -> new ResourceNotFoundException("Laboratorio no encontrado con id: " + requestDTO.getLabId()));

        result.setUserId(requestDTO.getUserId());
        result.setLabId(requestDTO.getLabId());
        result.setTestType(requestDTO.getTestType());
        result.setValueJson(requestDTO.getValueJson());
        result.setStatus(requestDTO.getStatus());
        result.setResultDate(requestDTO.getResultDate());

        Result updatedResult = resultRepository.save(result);
        return mapToResponseDTO(updatedResult);
    }

    @Transactional
    public void deleteResult(Long id) {
        if (!resultRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resultado no encontrado con id: " + id);
        }
        resultRepository.deleteById(id);
    }

    private ResultResponseDTO mapToResponseDTO(Result result) {
        ResultResponseDTO dto = new ResultResponseDTO();
        dto.setId(result.getId());
        dto.setUserId(result.getUserId());
        dto.setLabId(result.getLabId());
        dto.setTestType(result.getTestType());
        dto.setValueJson(result.getValueJson());
        dto.setStatus(result.getStatus());
        dto.setResultDate(result.getResultDate());

        if (result.getLab() != null) {
            dto.setLabName(result.getLab().getName());
        }

        return dto;
    }
}

package cl.duoc.laboratorio.results_service.repository;

import cl.duoc.laboratorio.results_service.model.Lab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabRepository extends JpaRepository<Lab, Long> {
}

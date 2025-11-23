package cl.duoc.laboratorio.labs_service.repository;

import cl.duoc.laboratorio.labs_service.model.Lab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LabRepository extends JpaRepository<Lab, Long> {
    Optional<Lab> findByName(String name);
    boolean existsByName(String name);
}

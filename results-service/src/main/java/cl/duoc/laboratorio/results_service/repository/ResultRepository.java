package cl.duoc.laboratorio.results_service.repository;

import cl.duoc.laboratorio.results_service.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByUserId(Long userId);
}

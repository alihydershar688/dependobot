package com.sql_dependobot.dependobot.repository;



import com.sql_dependobot.dependobot.entity.DependabotAlertEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DependabotAlertRepository extends JpaRepository<DependabotAlertEntity, Long> {
    List<DependabotAlertEntity> findAllByUserIdOrderByIdDesc(String userId);
}

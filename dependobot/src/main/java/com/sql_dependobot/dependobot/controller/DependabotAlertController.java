package com.sql_dependobot.dependobot.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import com.sql_dependobot.dependobot.entity.DependabotAlertEntity;
import com.sql_dependobot.dependobot.repository.DependabotAlertRepository;

@RestController
public class DependabotAlertController {

    private final DependabotAlertRepository dependabotAlertRepository;

    public DependabotAlertController(DependabotAlertRepository dependabotAlertRepository) {
        this.dependabotAlertRepository = dependabotAlertRepository;
    }

    @GetMapping("/api/dependabot-alerts")
    public List<DependabotAlertEntity> getAllAlerts(@AuthenticationPrincipal Jwt jwt) {
        return dependabotAlertRepository.findAllByUserIdOrderByIdDesc(jwt.getSubject());
    }
}

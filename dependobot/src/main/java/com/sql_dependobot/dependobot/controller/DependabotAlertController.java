package com.sql_dependobot.dependobot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sql_dependobot.dependobot.entity.DependabotAlertEntity;
import com.sql_dependobot.dependobot.repository.DependabotAlertRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class DependabotAlertController {

    @Autowired
    private DependabotAlertRepository dependabotAlertRepository;

    // Endpoint to get all dependabot alerts
    @GetMapping("/api/dependabot-alerts")
    public List<DependabotAlertEntity> getAllAlerts() {
        return dependabotAlertRepository.findAll();
    }
}

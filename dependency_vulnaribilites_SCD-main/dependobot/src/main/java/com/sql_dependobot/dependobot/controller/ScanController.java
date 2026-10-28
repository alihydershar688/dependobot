package com.sql_dependobot.dependobot.controller;

import com.sql_dependobot.dependobot.model.DependabotAlert;
import com.sql_dependobot.dependobot.model.RepoRequest;
import com.sql_dependobot.dependobot.service.ScanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ScanController {

    private final ScanService scanService;

    @PostMapping("/scan")
    public ResponseEntity<List<DependabotAlert>> scan(@RequestBody RepoRequest request) {
        List<DependabotAlert> alerts = scanService.scanRepo(request.getRepoUrl());
        return ResponseEntity.ok(alerts);
    }
}

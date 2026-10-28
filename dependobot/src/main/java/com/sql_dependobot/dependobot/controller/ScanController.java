package com.sql_dependobot.dependobot.controller;

import com.sql_dependobot.dependobot.model.DependabotAlert;
import com.sql_dependobot.dependobot.model.RepoRequest;
import com.sql_dependobot.dependobot.service.ScanService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ScanController {

    private final ScanService scanService;

    public ScanController(ScanService scanService) {
        this.scanService = scanService;
    }

    @PostMapping("/scan")
    public ResponseEntity<List<DependabotAlert>> scan(
            @RequestBody RepoRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        List<DependabotAlert> alerts = scanService.scanRepo(request.getRepoUrl(), jwt.getSubject());
        return ResponseEntity.ok(alerts);
    }
}

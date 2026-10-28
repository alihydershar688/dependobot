package com.sql_dependobot.dependobot.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.sql_dependobot.dependobot.entity.DependabotAlertEntity;
import com.sql_dependobot.dependobot.model.DependabotAlert;
import com.sql_dependobot.dependobot.repository.DependabotAlertRepository;
import com.sql_dependobot.dependobot.util.RepoUrlParser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScanService {

    private static final Logger logger = LoggerFactory.getLogger(ScanService.class);

    @Value("${github.token:}")
    private String githubToken;

    private final RestTemplate restTemplate = new RestTemplate();
    private final DependabotAlertRepository dependabotAlertRepository;

    public List<DependabotAlert> scanRepo(String repoUrl, String userId) {
        String[] repoParts = RepoUrlParser.parseRepoUrl(repoUrl);
        String owner = repoParts[0];
        String repo = repoParts[1];

        String apiUrl = "https://api.github.com/repos/" + owner + "/" + repo + "/dependabot/alerts";
        HttpHeaders headers = new HttpHeaders();
        if (githubToken != null && !githubToken.isBlank()) {
            headers.setBearerAuth(githubToken);
        }
        headers.set("Accept", "application/vnd.github+json");
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<DependabotAlert[]> response;
        try {
            response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.GET,
                    entity,
                    DependabotAlert[].class);
        } catch (RestClientException e) {
            logger.error("Failed to retrieve Dependabot alerts for {}", repoUrl, e);
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Could not retrieve Dependabot alerts. Check repository access and the backend GitHub token.",
                    e);
        }

        DependabotAlert[] body = response.getBody();
        List<DependabotAlert> alerts = Arrays.asList(body == null ? new DependabotAlert[0] : body);
        saveAlertsToDatabase(alerts, repoUrl, userId);
        return alerts;
    }

    private void saveAlertsToDatabase(List<DependabotAlert> alerts, String repoUrl, String userId) {
        for (DependabotAlert alert : alerts) {
            if (alert.getSecurityAdvisory() != null) {
                DependabotAlertEntity entity = new DependabotAlertEntity();
                entity.setRepoUrl(repoUrl);
                entity.setUserId(userId);
                entity.setState(alert.getState());

                DependabotAlert.SecurityAdvisory vuln = alert.getSecurityAdvisory();
                entity.setSeverity(vuln.getSeverity());
                entity.setDescription(vuln.getDescription());
                entity.setGhsa_id(vuln.getGhsa_id());
                entity.setCve_id(vuln.getCve_id());

                if (alert.getDependency() != null && alert.getDependency().getPkg() != null) {
                    entity.setPackageName(alert.getDependency().getPkg().getName());
                    entity.setEcosystem(alert.getDependency().getPkg().getEcosystem());
                }

                entity.setDismissedAt(alert.getDismissedAt());
                entity.setCreated_at(alert.getCreated_at());
                entity.setUpdated_at(alert.getUpdated_at());
                entity.setAlertUrl(alert.getAlertUrl());
                entity.setFixedInVersion(alert.getFixedInVersion());

                dependabotAlertRepository.save(entity);
            }
        }
    }

}
package com.sql_dependobot.dependobot.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.sql_dependobot.dependobot.entity.DependabotAlertEntity;
import com.sql_dependobot.dependobot.model.DependabotAlert;
import com.sql_dependobot.dependobot.repository.DependabotAlertRepository;
import com.sql_dependobot.dependobot.util.RepoUrlParser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScanService {

    @Value("${github.token}")
    private String githubToken;

    private final RestTemplate restTemplate = new RestTemplate();
    private final DependabotAlertRepository dependabotAlertRepository;

    public List<DependabotAlert> scanRepo(String repoUrl) {
        String[] repoParts = RepoUrlParser.parseRepoUrl(repoUrl);
        String owner = repoParts[0];
        String repo = repoParts[1];

        String apiUrl = "https://api.github.com/repos/" + owner + "/" + repo + "/dependabot/alerts";
        System.out.println("Token: " + githubToken); // confirm it's NOT null
        System.out.println("API URL: " + apiUrl);
        System.out.println("Auth Header: Bearer " + githubToken.substring(0, 6) + "...");

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(githubToken);
        headers.set("Accept", "application/vnd.github+json");
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<DependabotAlert[]> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.GET,
                    entity,
                    DependabotAlert[].class);

            System.out.println("Raw JSON: " + response.getBody());
            System.out.println("Response Status Code: " + response.getStatusCode());
            System.out.println("Response Body: " + Arrays.toString(response.getBody()));

            List<DependabotAlert> alerts = Arrays.asList(response.getBody());

            // Save alerts to SQL after fetching from GitHub API
            saveAlertsToDatabase(alerts, repoUrl);

            return alerts;
        } catch (Exception e) {
            System.err.println("Error occurred while calling GitHub API: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch alerts: " + e.getMessage());
        }
    }

    private void saveAlertsToDatabase(List<DependabotAlert> alerts, String repoUrl) {
        for (DependabotAlert alert : alerts) {
            if (alert.getSecurityAdvisory() != null) {
                DependabotAlertEntity entity = new DependabotAlertEntity();
                entity.setRepoUrl(repoUrl);
                entity.setState(alert.getState());

                DependabotAlert.SecurityAdvisory vuln = alert.getSecurityAdvisory();
                if (vuln != null) {
                    entity.setSeverity(vuln.getSeverity());
                    entity.setDescription(vuln.getDescription());
                    entity.setGhsa_id(vuln.getGhsa_id());
                    entity.setCve_id(vuln.getCve_id());
                } else {
                    System.out.println("Security vulnerability is null for alert: " + alert);
                }

                if (alert.getDependency() != null && alert.getDependency().getPkg() != null) {
                    entity.setPackageName(alert.getDependency().getPkg().getName());
                    entity.setEcosystem(alert.getDependency().getPkg().getEcosystem());
                }

                // Save new fields in the entity
                entity.setDismissedAt(alert.getDismissedAt());
                // entity.setDescription(alert.getDescription());
                entity.setCreated_at(alert.getCreated_at());
                entity.setUpdated_at(alert.getUpdated_at());
                entity.setAlertUrl(alert.getAlertUrl());
                entity.setFixedInVersion(alert.getFixedInVersion());

                // Log before saving
                System.out.println("Saving alert: " + entity);

                dependabotAlertRepository.save(entity);
                System.out.println("Alert saved: " + entity);
            } else {
                System.out.println("No security vulnerability found for alert: " + alert);
            }
        }
    }

}
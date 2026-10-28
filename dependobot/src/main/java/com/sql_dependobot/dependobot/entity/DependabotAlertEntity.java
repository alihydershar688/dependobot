package com.sql_dependobot.dependobot.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "dependabot_alerts")
public class DependabotAlertEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "repo_url")
    private String repoUrl;

    @Column(name = "user_id", nullable = false)
    @JsonIgnore
    private String userId;

    @Column(name = "state")
    private String state;

    @Column(name = "severity")
    private String severity;

    @Column(name = "description")
    private String description;

    @Column(name = "ghsa_id")
    private String ghsa_id;

    @Column(name = "cve_id")
    private String cve_id;

    @Column(name = "package_name")
    private String packageName;

    @Column(name = "ecosystem")
    private String ecosystem;

    // New fields to capture additional data
    @Column(name = "dismissed_at")
    private String dismissedAt;  // When the alert was dismissed (if applicable)

    @Column(name = "created_at")
    private String created_at;    // When the alert was created

    @Column(name = "updated_at")
    private String updated_at;    // When the alert was last updated

    @Column(name = "alert_url")
    private String alertUrl;     // URL of the alert in GitHub

    @Column(name = "fixed_in_version")
    private String fixedInVersion;  // The version in which the vulnerability was fixed (if applicable)
}

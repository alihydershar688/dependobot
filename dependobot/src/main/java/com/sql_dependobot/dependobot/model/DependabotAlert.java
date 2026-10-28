package com.sql_dependobot.dependobot.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DependabotAlert {

    private String state; // State of the alert (e.g., "open", "dismissed")
    private Dependency dependency; // Dependency info, including package name and ecosystem

    @JsonProperty("security_advisory")
    private SecurityAdvisory securityAdvisory; // Security vulnerability info

    private String dismissedAt; // When the alert was dismissed, if applicable
    private String created_at; // When the alert was created
    private String updated_at; // When the alert was last updated

    @JsonProperty("url")
    private String alertUrl; // URL of the alert in GitHub

    @JsonProperty("fixed_in")
    private String fixedInVersion; // The version in which the vulnerability was fixed, if applicable

    @Data
    public static class Dependency {
        @JsonProperty("package")
        private PackageInfo pkg; // Package details, including name and ecosystem

        @Data
        public static class PackageInfo {
            private String name; // Name of the package
            private String ecosystem; // Ecosystem (e.g., npm, Maven, etc.)
        }
    }

    @Data
    public static class SecurityAdvisory {
        private String severity; // Severity of the vulnerability (e.g., "high", "medium")
        private String description; // Description of the vulnerability

        @JsonProperty("ghsa_id")
        private String ghsa_id; // GitHub Security Advisory ID

        @JsonProperty("cve_id")
        private String cve_id; // CVE ID (Common Vulnerabilities and Exposures)
    }
}

package com.sql_dependobot.dependobot.util;


import java.net.URI;

public class RepoUrlParser {
    public static String[] parseRepoUrl(String url) {
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("Expected a GitHub repository URL in the form https://github.com/owner/repository");
        }

        try {
            URI uri = URI.create(url);
            if (!"https".equalsIgnoreCase(uri.getScheme())
                    || !"github.com".equalsIgnoreCase(uri.getHost())
                    || uri.getQuery() != null
                    || uri.getFragment() != null) {
                throw new IllegalArgumentException();
            }

            String path = uri.getPath();
            String[] parts = path == null ? new String[0] : path.replaceAll("^/|/$", "").split("/");
            if (parts.length != 2 || parts[0].isBlank() || parts[1].isBlank()) {
                throw new IllegalArgumentException();
            }

            String repository = parts[1].endsWith(".git")
                    ? parts[1].substring(0, parts[1].length() - 4)
                    : parts[1];
            if (repository.isBlank()) {
                throw new IllegalArgumentException();
            }
            return new String[]{ parts[0], repository };
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Expected a GitHub repository URL in the form https://github.com/owner/repository");
        }
    }
}
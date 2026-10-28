package com.sql_dependobot.dependobot.util;


import java.net.URI;

public class RepoUrlParser {
    public static String[] parseRepoUrl(String url) {
        try {
            URI uri = URI.create(url);
            String[] parts = uri.getPath().split("/");
            return new String[]{ parts[1], parts[2] };
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid repo URL");
        }
    }
}
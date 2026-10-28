package com.sql_dependobot.dependobot.util;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class RepoUrlParserTest {

    @Test
    void parsesGitHubRepositoryUrl() {
        assertArrayEquals(
                new String[] { "owner", "repository" },
                RepoUrlParser.parseRepoUrl("https://github.com/owner/repository"));
    }

    @Test
    void acceptsGitSuffix() {
        assertArrayEquals(
                new String[] { "owner", "repository" },
                RepoUrlParser.parseRepoUrl("https://github.com/owner/repository.git"));
    }

    @Test
    void rejectsNonGitHubHosts() {
        assertThrows(
                IllegalArgumentException.class,
                () -> RepoUrlParser.parseRepoUrl("https://example.com/owner/repository"));
    }

    @Test
    void rejectsNestedPaths() {
        assertThrows(
                IllegalArgumentException.class,
                () -> RepoUrlParser.parseRepoUrl("https://github.com/owner/repository/tree/main"));
    }
}

import React from "react"
import styles from "./ResultTable.module.css"

export default function ResultsTable({ results, isLoading }) {
  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <span className={styles.loaderText}>Scanning repository...</span>
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "critical":
        return styles.critical
      case "high":
        return styles.high
      case "medium":
        return styles.medium
      case "low":
        return styles.low
      default:
        return styles.unknown
    }
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.packageCol}>Package</th>
            <th>Current Version</th>
            <th>Vulnerable Version</th>
            <th>Severity</th>
            <th className={styles.descriptionCol}>Description</th>
            <th>Fixed Version</th>
          </tr>
        </thead>
        <tbody>
          {results.map((vuln) => (
            <tr key={vuln.id}>
              <td className={styles.packageName}>{vuln.package}</td>
              <td>{vuln.currentVersion}</td>
              <td>{vuln.vulnerableVersion}</td>
              <td>
                <span className={`${styles.badge} ${getSeverityClass(vuln.severity)}`}>
                  {vuln.severity}
                </span>
              </td>
              <td>{vuln.description}</td>
              <td>{vuln.fixedVersion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

use sql_depo;
select * from dependabot_alerts;
DELETE FROM dependabot_alerts;
DELETE FROM dependabot_alerts WHERE 1=1;
SET SQL_SAFE_UPDATES = 0;
ALTER TABLE dependabot_alerts 
ADD COLUMN alert_url VARCHAR(255),
ADD COLUMN created_at VARCHAR(255),
ADD COLUMN updated_at VARCHAR(255),
ADD COLUMN dismissed_at VARCHAR(255),
ADD COLUMN fixed_in_version VARCHAR(255);


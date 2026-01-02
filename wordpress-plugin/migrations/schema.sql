-- AutoWriter Multisite Database Schema

CREATE TABLE IF NOT EXISTS {base_prefix}autowriter_jobs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    external_job_id VARCHAR(100) NOT NULL,
    blog_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    step VARCHAR(100) DEFAULT 'payload_received',
    idempotency_key VARCHAR(128) NOT NULL,
    post_id BIGINT DEFAULT NULL,
    payload_hash CHAR(64) NOT NULL,
    error_code VARCHAR(100) DEFAULT NULL,
    error_message TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY idempotency_key (idempotency_key),
    INDEX blog_status (blog_id, status),
    INDEX external_job_id (external_job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS {base_prefix}autowriter_logs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    job_id BIGINT NOT NULL,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    context_json LONGTEXT DEFAULT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    INDEX job_id (job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

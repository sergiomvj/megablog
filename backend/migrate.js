import { pool } from './services/db.js';

const sqls = [
  `CREATE TABLE IF NOT EXISTS batches (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    source_csv_filename TEXT,
    created_by TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'created',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(36) PRIMARY KEY,
    batch_id VARCHAR(36),
    job_key TEXT NOT NULL,
    idempotency_key VARCHAR(100) NOT NULL,
    revision INT NOT NULL DEFAULT 1,
    blog_key TEXT NOT NULL,
    blog_id BIGINT NOT NULL,
    category TEXT,
    objective_pt TEXT,
    theme_pt TEXT,
    language_target VARCHAR(10) NOT NULL,
    word_count INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'queued',
    current_step VARCHAR(20) NOT NULL DEFAULT 'T0',
    progress INT NOT NULL DEFAULT 0,
    attempts INT NOT NULL DEFAULT 0,
    last_error TEXT,
    wp_post_id BIGINT,
    wp_post_url TEXT,
    selected BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (idempotency_key),
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS job_artifacts (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36),
    revision INT NOT NULL,
    task VARCHAR(50) NOT NULL,
    schema_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    json_data JSON NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (job_id, revision, task),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS llm_usage_events (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36),
    revision INT NOT NULL,
    task VARCHAR(50) NOT NULL,
    provider_key VARCHAR(50) NOT NULL,
    model_id VARCHAR(100) NOT NULL,
    prompt_version VARCHAR(20) NOT NULL,
    input_tokens INT NOT NULL DEFAULT 0,
    output_tokens INT NOT NULL DEFAULT 0,
    latency_ms INT NOT NULL DEFAULT 0,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    fallback_used BOOLEAN NOT NULL DEFAULT FALSE,
    event_type VARCHAR(20) NOT NULL DEFAULT 'primary',
    raw_meta JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS pricing_profiles (
    profile_key VARCHAR(50) PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    input_per_1m_tokens DECIMAL(12,6) NOT NULL,
    output_per_1m_tokens DECIMAL(12,6) NOT NULL,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS job_cost_estimates (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36),
    revision INT NOT NULL,
    profile_key VARCHAR(50),
    estimated_cost_usd DECIMAL(14,6) NOT NULL,
    breakdown_json JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (job_id, revision, profile_key),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (profile_key) REFERENCES pricing_profiles(profile_key) ON DELETE RESTRICT
  )`
];

async function migrate() {
  try {
    console.log('Starting migration for MariaDB/MySQL...');
    for (const sql of sqls) {
      await pool.query(sql);
    }
    console.log('Migration successful.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
Sands

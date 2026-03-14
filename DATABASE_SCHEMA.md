# MVP Database Schema Step

This is the next build step after project setup and Supabase connection.

Goal:

- define the minimum database structure for TeleGuard Pro
- support simulated Call Detail Records
- support fraud rule evaluation
- support alert generation
- support blocked number management

## Main Flow

The MVP database should support this flow:

```text
call_detail_records -> fraud_rules -> fraud_alerts -> blocked_numbers
```

## 1. Core Tables

Create these four tables first:

- `call_detail_records`
- `fraud_rules`
- `fraud_alerts`
- `blocked_numbers`

Do not add enterprise complexity yet.

## 2. Table Responsibilities

### `call_detail_records`

Stores simulated telecom activity.

Use it for:

- incoming call data
- normal call history
- suspicious call patterns
- risk scoring inputs

Recommended fields:

- `id`
- `caller_number`
- `receiver_number`
- `call_start`
- `call_end`
- `duration_seconds`
- `call_type`
- `source_country`
- `destination_country`
- `source_network`
- `destination_network`
- `cost`
- `status`
- `risk_score`
- `is_suspicious`
- `metadata`
- `created_at`

### `fraud_rules`

Stores configurable fraud detection rules.

Use it for:

- threshold-based checks
- route-based checks
- geo anomaly checks
- high-frequency call checks

Recommended fields:

- `id`
- `name`
- `description`
- `rule_type`
- `severity`
- `threshold_value`
- `configuration`
- `is_active`
- `created_at`

### `fraud_alerts`

Stores generated fraud incidents.

Use it for:

- alert creation
- severity tracking
- investigation workflow
- alert resolution status

Recommended fields:

- `id`
- `title`
- `description`
- `severity`
- `status`
- `reason`
- `risk_score`
- `cdr_id`
- `rule_id`
- `source_number`
- `created_at`
- `acknowledged_at`
- `resolved_at`

### `blocked_numbers`

Stores blocked phone numbers.

Use it for:

- automated blocking
- manual blocking
- audit of block reasons

Recommended fields:

- `id`
- `phone_number`
- `reason`
- `source_alert_id`
- `blocked_by_rule_id`
- `is_active`
- `blocked_at`
- `unblocked_at`

## 3. MVP Design Rules

For hackathon, keep these rules:

- store simulated records only
- keep rule configuration in JSON where flexibility is needed
- use simple text fields instead of over-modeling enums in the first version
- keep blocking separate from alerts
- keep fraud scoring simple

## 4. SQL File

Run the SQL in:

[mvp-schema.sql](/home/bacancy/Desktop/hackathon-project/tele-guard-pro/supabase/mvp-schema.sql)

This creates:

- all 4 MVP tables
- foreign keys
- useful indexes
- updated `Database` types can be added later after schema is finalized

## 5. Recommended First Rules

Start with only 3 to 4 fraud rules:

- too many calls from one number in a short time
- one number calling many countries quickly
- very high total duration in a short window
- repeated failed or blocked call attempts

## 6. What Is Complete In This Step

This step is complete when:

- all 4 tables exist in Supabase
- SQL runs without errors
- you can insert a sample CDR row
- you can insert a sample fraud alert
- you can mark a number as blocked

## Next Step

After schema creation, the next step is:

- seed sample CDR data
- add one fraud detection service
- generate alerts automatically

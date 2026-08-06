# Adding New Vulnerability Checks (Payload Templates)

WebSec Auditor's active scanning engine is data-driven. You do not need to write Python code to add new SQLi, XSS, or Command Injection payloads. Checks are defined in YAML templates located in `app/payload_templates/`.

## Template Structure

Each template requires the following fields:

```yaml
id: unique-id-for-check
category: sqli | xss | cmdi
technique: descriptive_technique_name (e.g., error_based, reflected)
severity: critical | high | medium | low
payloads:
  - "payload string 1"
  - "payload string 2"
match:
  type: regex | string_in_response
  # For regex:
  patterns:
    - "regex pattern 1"
    - "regex pattern 2"
  flags: IGNORECASE # optional
  # For string_in_response:
  check: "payload_in_response_unescaped"
remediation: >
  A multi-line, plain English explanation of how a developer should
  fix the vulnerability that this payload detects.
```

## Examples

### Adding a new Command Injection Check
Create a new file: `app/payload_templates/cmdi/linux_basics.yaml`

```yaml
id: cmdi-linux-basic-001
category: cmdi
technique: basic_execution
severity: critical
payloads:
  - "; cat /etc/passwd"
  - "| cat /etc/passwd"
match:
  type: regex
  patterns:
    - "root:.*:0:0:"
remediation: >
  Do not pass user input to shell commands. Use parameterized APIs or built-in language functions.
```

### Adding a new SQLi Check
Create a new file: `app/payload_templates/sqli/auth_bypass.yaml`

```yaml
id: sqli-auth-bypass-001
category: sqli
technique: boolean_bypass
severity: high
payloads:
  - "admin' --"
  - "admin' #"
  - "admin'/*"
match:
  type: regex
  patterns:
    - "Welcome back, admin"
    - "Dashboard"
remediation: >
  Use parameterized queries or an ORM for all database access.
```

## How the Engine Processes Templates
1. The engine discovers parameters in URLs (`?id=1`) and HTML Forms (`<input name="q">`).
2. It iterates through every template in the relevant category folder.
3. It iterates through every payload in the template.
4. It injects the payload and sends the HTTP request.
5. It evaluates the `match` criteria against the HTTP response.
6. If a match occurs, a `Finding` is saved and the engine moves to the next parameter.

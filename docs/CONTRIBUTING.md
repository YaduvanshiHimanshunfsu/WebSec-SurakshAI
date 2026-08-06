# Contributing to WebSec Auditor

Contributions are welcome, especially in the form of new Passive Check modules or new Active Payload Templates!

## How to Contribute Payload Templates
Adding new checks for the active scanner is the easiest way to contribute. You do not need to know Python.

1. Browse to `app/payload_templates/`
2. Create a new YAML file in the appropriate category (e.g., `sqli`, `xss`, `cmdi`).
3. Follow the format described in `PAYLOAD_TEMPLATES.md`.
4. Submit a Pull Request.

## How to Contribute Code
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-new-check`
3. Write your code.
4. Ensure tests pass by running `pytest tests/`
5. Submit a Pull Request with a clear description of what your code does and why it's needed.

## Code Style
- We follow standard PEP-8.
- Use type hints (`-> dict`, `: str`) for function signatures.
- Keep the `passive/` and `active/` module boundary strict. Active scanning code must NEVER be reachable without passing through `authorization.py`.

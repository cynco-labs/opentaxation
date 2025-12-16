# Security Policy

## Reporting a Vulnerability

We take security seriously at OpenTaxation.my. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email us at: **security@opentaxation.my**

Include the following information:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### What to Expect

1. **Acknowledgment**: We will acknowledge your report within 48 hours
2. **Investigation**: We will investigate and provide updates within 7 days
3. **Resolution**: We aim to fix critical issues within 30 days
4. **Credit**: We will credit you in our release notes (unless you prefer anonymity)

### Scope

This policy applies to:
- The OpenTaxation.my web application
- The `@tax-engine/core` and `@tax-engine/config` packages
- Our GitHub repository

### Out of Scope

- Third-party services (Supabase, Vercel, etc.)
- Social engineering attacks
- Physical security
- Denial of service attacks

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Best Practices

This project follows security best practices:
- Input sanitization with DOMPurify
- Content Security Policy headers
- No sensitive data stored client-side
- Row-level security in database
- Environment variables for secrets
- Regular dependency updates

Thank you for helping keep OpenTaxation.my secure!

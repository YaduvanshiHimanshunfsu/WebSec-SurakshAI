# Legal Guidelines for WebSec Auditor

**WARNING: Using active scanning tools against systems without explicit permission is illegal.**

## The Golden Rule
Never use the Active Scanner module against any website, application, or infrastructure that you do not own, or for which you do not have explicit, written authorization to test. 

## Understanding the Law (Context: India IT Act & US CFAA)

### India: Information Technology Act, 2000
- **Section 43 (Penalty and Compensation for damage to computer, computer system, etc.):** If any person without permission of the owner or any other person who is in charge of a computer, computer system or computer network accesses or secures access to such computer... they shall be liable to pay damages by way of compensation to the person so affected.
- **Section 66 (Computer Related Offences):** If any person, dishonestly or fraudulently, does any act referred to in section 43, he shall be punishable with imprisonment for a term which may extend to three years or with fine...

### United States: Computer Fraud and Abuse Act (CFAA)
Accessing a computer without authorization, or in excess of authorized access, can be a federal crime carrying significant penalties including imprisonment.

## The Authorization Gate
Because of these severe legal realities, WebSec Auditor is designed with a strict Authorization Gate. 

1. **Passive Scans are Safe:** Gathering publicly broadcast TLS certificates, HTTP headers, and checking reputation databases (Passive Scan) does not constitute unauthorized access. 
2. **Active Scans Require Verification:** Injecting SQL payloads, XSS test scripts, or command separators (Active Scan) crosses the line into unauthorized access. WebSec Auditor will refuse to run active scans unless the target is:
   - A recognized Sandbox environment (e.g., `localhost:5001`).
   - A domain that has been verified via a DNS TXT record challenge, proving ownership/control.

By using this software, you agree to take full legal responsibility for your actions. The authors of WebSec Auditor assume no liability for misuse.

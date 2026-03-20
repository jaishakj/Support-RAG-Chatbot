SAMPLE_DOCUMENTS = [
    {
        "title": "Account Setup Guide",
        "content": """
# Account Setup Guide

## Creating Your Account
To create a new account, visit our website and click "Sign Up" in the top right corner.
Fill in your name, email address, and create a strong password (minimum 8 characters with at least one uppercase letter, number, and special character).

## Email Verification
After registration, you'll receive a verification email within 5 minutes. Click the link inside to verify.
If you don't see the email, check your spam folder. You can resend the verification from the login page.

## Setting Up Two-Factor Authentication (2FA)
We strongly recommend enabling 2FA for account security. Go to Settings > Security > Two-Factor Authentication.
We support authenticator apps (Google Authenticator, Authy) and SMS-based 2FA.

## Profile Completion
Complete your profile by adding a profile picture, timezone, and notification preferences.
A complete profile improves your experience and allows our support team to assist you faster.

## Troubleshooting Account Setup
- "Email already registered": Use the password reset option if you forgot your credentials.
- "Verification link expired": Links expire after 24 hours. Request a new one from the login page.
- "Account locked": After 5 failed login attempts, accounts lock for 30 minutes for security.
        """,
        "category": "account",
        "doc_id": "ACC-001"
    },
    {
        "title": "Billing and Subscription FAQ",
        "content": """
# Billing and Subscription FAQ

## Subscription Plans
We offer three plans: Starter ($9/mo), Professional ($29/mo), and Enterprise (custom pricing).
Starter: Up to 3 users, 10GB storage, email support.
Professional: Up to 25 users, 100GB storage, priority support, API access.
Enterprise: Unlimited users, unlimited storage, dedicated support, SLA guarantees.

## Payment Methods
We accept Visa, Mastercard, American Express, PayPal, and bank transfers (Enterprise only).
All transactions are processed securely via Stripe. We never store your full card details.

## Billing Cycles
Subscriptions renew monthly or annually. Annual plans receive a 20% discount.
Invoices are sent via email on your billing date and are available in Settings > Billing.

## Upgrading or Downgrading
You can upgrade at any time; charges are prorated immediately.
Downgrades take effect at the end of the current billing cycle.

## Refund Policy
We offer a 14-day money-back guarantee for new subscriptions.
No refunds are issued after 14 days or for annual subscriptions beyond the first 30 days.

## Common Billing Issues
- "Payment declined": Update your card in Settings > Billing > Payment Methods.
- "Double charged": Contact support with transaction IDs; we resolve within 1 business day.
- "Missing invoice": Check Settings > Billing > Invoice History or contact support.
- "Cancel subscription": Go to Settings > Billing > Cancel Subscription. Access continues until period end.
        """,
        "category": "billing",
        "doc_id": "BIL-001"
    },
    {
        "title": "API Integration Guide",
        "content": """
# API Integration Guide

## Getting Your API Key
Navigate to Settings > Developer > API Keys to generate your key.
Keep your API key secret. Never expose it in client-side code or public repositories.

## Authentication
All API requests must include your key in the Authorization header:
Authorization: Bearer YOUR_API_KEY

## Rate Limits
Starter plan: 100 requests/minute, 10,000 requests/day.
Professional plan: 1,000 requests/minute, 100,000 requests/day.
Enterprise plan: Custom limits. Contact us for high-volume needs.

## Common Endpoints
GET /api/v1/users - List all users in your organization.
POST /api/v1/data - Submit new data records.
GET /api/v1/reports - Fetch analytics reports.
DELETE /api/v1/data/{id} - Delete a specific record.

## Webhooks
Set up webhooks to receive real-time event notifications.
Go to Settings > Developer > Webhooks to configure endpoint URLs.
We sign all webhook payloads with your webhook secret using HMAC-SHA256.

## SDKs Available
Official SDKs: Python, Node.js, Ruby, PHP, Go.
Install Python SDK: pip install our-platform-sdk
Install Node SDK: npm install @ourplatform/sdk

## Error Codes
400: Bad Request - Check your request body and parameters.
401: Unauthorized - Verify your API key is valid and not expired.
429: Too Many Requests - You've exceeded rate limits. Implement exponential backoff.
500: Internal Server Error - Our side. Status page at status.ourplatform.com.

## Pagination
All list endpoints return paginated results. Use cursor-based pagination:
GET /api/v1/users?cursor=next_cursor_value&limit=50
        """,
        "category": "api",
        "doc_id": "API-001"
    },
    {
        "title": "Data Security and Privacy",
        "content": """
# Data Security and Privacy

## Data Encryption
All data is encrypted at rest using AES-256 and in transit using TLS 1.3.
Database backups are also encrypted and stored in geographically separate regions.

## Compliance
We are SOC 2 Type II certified, GDPR compliant, and CCPA compliant.
Healthcare customers: We support HIPAA compliance with a signed BAA (Business Associate Agreement).
Enterprise customers can request our compliance documentation from their account manager.

## Data Residency
By default, data is stored in US-East data centers.
Enterprise customers can request EU or APAC data residency for an additional fee.

## Data Retention
User data is retained for the duration of the subscription plus 90 days after cancellation.
You can export all your data at any time from Settings > Data > Export.
After the retention period, data is permanently and irreversibly deleted.

## GDPR Requests
To submit a data access, deletion, or portability request, email privacy@ourplatform.com.
We respond to all GDPR requests within 30 days as required by law.

## Security Incident Response
We notify affected users within 72 hours of discovering a security incident.
Historical security advisories are available at security.ourplatform.com.

## Penetration Testing
We conduct annual third-party penetration tests. Summaries available to Enterprise customers on request.
If you discover a security vulnerability, please report it to security@ourplatform.com.
        """,
        "category": "security",
        "doc_id": "SEC-001"
    },
    {
        "title": "Troubleshooting Common Issues",
        "content": """
# Troubleshooting Common Issues

## Login Problems
Problem: "Invalid credentials" despite correct password.
Solution: Use password reset. If the problem persists, check if you're using the correct email (some users have multiple accounts).

Problem: Account locked.
Solution: Wait 30 minutes or contact support to unlock immediately.

Problem: SSO not working.
Solution: Ensure your IT admin has correctly configured the SAML settings. Our SSO setup guide is at docs.ourplatform.com/sso.

## Performance Issues
Problem: Dashboard loading slowly.
Solution: Clear browser cache. Try incognito mode. Check status.ourplatform.com for incidents.
If the problem persists, try a different browser. Chrome and Firefox are best supported.

Problem: File uploads failing.
Solution: Max file size is 100MB per file. Supported formats: PDF, CSV, XLSX, PNG, JPG, DOCX.
Check your storage quota in Settings > Usage.

## Data Sync Issues
Problem: Data not syncing between devices.
Solution: Force-sync by clicking the sync icon in the top bar. Wait 2-3 minutes for propagation.
Sync requires an active internet connection. Offline changes sync automatically when reconnected.

Problem: Integration data not updating.
Solution: Disconnect and reconnect the integration from Settings > Integrations.
Check if the third-party service is experiencing downtime.

## Email Notifications
Problem: Not receiving email notifications.
Solution: Check spam/junk folder. Whitelist notifications@ourplatform.com.
Verify notification settings at Settings > Notifications.

## Browser Compatibility
Fully supported: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.
Not supported: Internet Explorer (any version).
        """,
        "category": "troubleshooting",
        "doc_id": "TRB-001"
    },
    {
        "title": "Team Management and Permissions",
        "content": """
# Team Management and Permissions

## User Roles
Owner: Full access, billing control, can delete the organization.
Admin: Manage users, settings, integrations. Cannot change billing.
Manager: Manage projects and team members assigned to them.
Member: Standard access to assigned projects and features.
Viewer: Read-only access. Cannot create, edit, or delete content.

## Inviting Team Members
Go to Settings > Team > Invite Members. Enter email addresses and select a role.
Invitations expire after 7 days. You can resend or cancel pending invitations.

## Removing Team Members
Removed members lose access immediately. Their created content remains and is reassigned to the admin.
You can transfer ownership of specific items before removing a user.

## Custom Permissions
Enterprise plans support custom role creation with granular permissions.
Contact your account manager to set up custom roles.

## Single Sign-On (SSO)
Supported SSO providers: Okta, Azure AD, Google Workspace, OneLogin.
SSO configuration guide: docs.ourplatform.com/sso
With SSO enforced, users cannot log in with email/password.

## Audit Logs
Admin and Owner roles can access audit logs at Settings > Security > Audit Log.
Logs track: logins, data exports, permission changes, deletions.
Audit logs are retained for 12 months (Enterprise: 36 months).

## Guest Access
You can invite external guests with limited, project-specific access.
Guests cannot see organization-wide data, team members, or billing information.
        """,
        "category": "team",
        "doc_id": "TEAM-001"
    },
    {
        "title": "Integrations and Third-Party Apps",
        "content": """
# Integrations and Third-Party Apps

## Available Integrations
Productivity: Slack, Microsoft Teams, Google Workspace, Notion.
CRM: Salesforce, HubSpot, Pipedrive.
Project Management: Jira, Asana, Trello, Monday.com.
Storage: Google Drive, Dropbox, OneDrive, Box.
Analytics: Google Analytics, Mixpanel, Amplitude.
Payment: Stripe, PayPal, Square.

## Setting Up Integrations
Go to Settings > Integrations and select the app you want to connect.
Click "Connect" and follow the OAuth authorization flow.
Configure sync settings and field mappings as needed.

## Slack Integration
Connect Slack to receive real-time notifications in your channels.
Available notifications: New comments, task assignments, status changes, alerts.
Use /ourplatform commands in Slack: /ourplatform status, /ourplatform create-task.

## Zapier and Make (Webhooks)
Use Zapier or Make to connect with 5,000+ apps we don't natively support.
Webhook URL is available at Settings > Developer > Webhooks.
Triggers available: New record, updated record, deleted record, status change.

## Integration Issues
Problem: OAuth authorization fails.
Solution: Try in incognito mode. Ensure pop-ups are allowed. Clear cookies.

Problem: Data not syncing from integration.
Solution: Disconnect and reconnect the integration. Check if required API permissions were granted.

Problem: Integration showing as "disconnected".
Solution: The third-party app may have revoked access (password change, security policy). Reconnect.

## Enterprise Integrations
Custom integrations and dedicated connectors are available for Enterprise plans.
Contact your account manager or email integrations@ourplatform.com.
        """,
        "category": "integrations",
        "doc_id": "INT-001"
    },
    {
        "title": "Mobile App Guide",
        "content": """
# Mobile App Guide

## Downloading the App
iOS: Available on the App Store, requires iOS 15 or later.
Android: Available on Google Play Store, requires Android 10 or later.

## Mobile Features
The mobile app supports: viewing dashboards, receiving notifications, approving requests, commenting, and uploading files from your camera roll.
Some advanced features are desktop-only: bulk operations, advanced reporting, admin settings.

## Push Notifications
Enable push notifications during onboarding or in the app under Profile > Notifications.
You can customize which events trigger push notifications.

## Offline Mode
The mobile app caches your most recent data for offline viewing.
Changes made offline sync automatically when you reconnect to the internet.
File uploads are queued and completed when online.

## Mobile Security
The app supports biometric authentication (Face ID, Touch ID, fingerprint).
Enable it under Profile > Security > Biometric Login.
You can remotely sign out all mobile sessions from Settings > Security > Active Sessions on the web.

## Common Mobile Issues
Problem: App crashing on launch.
Solution: Update to the latest version. Clear app cache in device settings. Reinstall if needed.

Problem: Notifications not working.
Solution: Check app notification permissions in your device settings. Re-enable if needed.

Problem: Biometric login not working.
Solution: Disable and re-enable biometric login in Profile > Security. Re-scan your biometric.

Problem: Data not loading.
Solution: Check internet connection. Pull down to refresh. Log out and back in if the issue persists.
        """,
        "category": "mobile",
        "doc_id": "MOB-001"
    },
]

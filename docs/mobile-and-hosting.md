# Gwave Mobile and Hosting Runbook

## Deployment decision

The current Gwave project is a full-stack React, Node.js, MySQL, and private object-storage application. Its managed hosting path is the most direct choice for the initial launch because database access, login, S3-backed file storage, owner notifications, TLS, and rollback are already integrated.

If Google Cloud remains a firm production requirement, deploy the Node server as a single service and keep the database, object storage, environment variables, and authentication callback configuration coordinated. Do not expose payment-slip object keys or the server-side storage credentials to the client in either deployment model.

| Requirement | Managed launch path | Google Cloud alternative |
|---|---|---|
| Web application hosting | Publish the checked project from the project UI | Build the Node application and deploy it to Cloud Run |
| Database | Use the configured application database | Provision Cloud SQL for MySQL and supply a private `DATABASE_URL` |
| Payment slip images | Use the server-side S3 helper and private storage key | Use a private bucket and equivalent server-only signed URL flow |
| Secrets | Add through the project secrets interface | Store in Secret Manager and mount as runtime environment variables |
| Custom domain and TLS | Configure in project settings | Configure Cloud Run domain mapping or a HTTPS load balancer |
| Logs and rollback | Use the project dashboard and version history | Use Cloud Logging, Cloud Build/Artifact Registry, revisions, and release promotion |

## Google Cloud prerequisites

Before a Google Cloud production release, obtain a Google Cloud billing account, a dedicated project, an approved domain, a Cloud SQL database, a private storage bucket, Secret Manager entries, and a service account restricted to the least permissions needed. Configure CORS, OAuth callback URLs, trusted origins, database private networking, backups, monitoring, retention rules, and a production incident contact before go-live.

> Do not configure a third-party payment processor for restricted cannabis-related products unless it has explicitly approved the exact product categories, territories, and fulfilment model in writing.

## Android APK route

The current website can be wrapped as an Android application with Capacitor after the web deployment URL, Android package ID, app icon, privacy links, and support contacts are final. Use a Trusted Web Activity or Capacitor only after confirming that the relevant app store, hosting provider, payment provider, and local regulations allow the exact business model.

| Step | Owner input required |
|---|---|
| Register package identity | A unique reverse-domain app ID, for example `com.yourcompany.gwave` |
| Add Capacitor project | App name, package ID, Android target SDK, icons, splash assets |
| Build signed APK/AAB | Android signing keystore, alias, and secure credential storage |
| Release testing | Android device testing, age-gate test, sign-in test, restricted-access test, privacy test |
| Publish or distribute | Google Play developer account or approved direct-distribution channel |

For production mobile releases, prefer an Android App Bundle (`.aab`) for Google Play and retain the signed APK only for approved internal or direct testing flows.

## Pre-launch checklist

Verify all pages against the legal jurisdiction, approve policies with qualified counsel, create verified admin/staff accounts, add real catalogue and content records, review stock and order workflows, complete private slip retrieval testing, confirm notification delivery, and run a full checkout rehearsal with a non-production order before accepting customer transactions.

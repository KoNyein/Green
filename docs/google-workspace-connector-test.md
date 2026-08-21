# Google Workspace Connector Test

Test date: 2026-08-21. The Google Workspace connector was enabled for this session and tested with read-only Google Drive and Google Sheets requests through the preconfigured `gws` CLI. No files, sheets, emails, or calendar events were modified.

## Fetched Drive data

A Drive files list request returned the following recent items:

| Name | Type | Modified time |
| --- | --- | --- |
| `applet_access_history.json` | JSON file | 2026-08-21 12:33 UTC |
| `DevOps For Developers Program` | Folder | 2026-08-21 10:13 UTC |
| `AWS + Terraform + Boto3` | Folder | 2026-08-21 10:13 UTC |
| `3. ClusterIP Hands On.mov` | QuickTime video | 2026-08-21 08:27 UTC |
| `2. Deployment Hands On.mov` | QuickTime video | 2026-08-21 08:27 UTC |
| `1. Deployment and Service .mov` | QuickTime video | 2026-08-21 08:27 UTC |
| `Untitled document` | Google Doc | 2026-08-19 07:06 UTC |
| `Knowledge Sharing (2026)` | Google Sheet | 2026-08-18 16:05 UTC |

## Fetched Sheets metadata

The spreadsheet titled `Knowledge Sharing (2026)` uses the `Asia/Rangoon` timezone and contains three tabs: `AWS Certified Cloud Practitioner`, `AWS Certified AI Practitioner`, and `Red Hat System Administration`. Each tab is a 26-column by 1,000-row grid according to the returned metadata. The spreadsheet locale is `en_US`, and its recalculation mode is `ON_CHANGE`.

## Capabilities overview

The connector can read and manage Google Drive files and folders, read and write Google Sheets, read and write Google Docs, manage Slides, read and manage Gmail, manage Calendar events, and work with Forms, Tasks, Contacts, Chat, Classroom, Meet, Apps Script, and other supported Workspace services. Access is bounded by the Google account authorization and the specific API scopes granted by the connector.

For safe operational use, start with read-only list/get calls. Use write operations only after confirming the target file, account, and intended change. Avoid placing private customer documents, payment slips, OAuth credentials, or signing keys into shared Workspace files without an explicit access policy.

## Example commands

```bash
gws drive files list --params '{"pageSize":10,"orderBy":"modifiedTime desc","fields":"files(id,name,mimeType,modifiedTime,webViewLink)"}' --format table

gws sheets spreadsheets get --params '{"spreadsheetId":"SPREADSHEET_ID"}' --format json
```

The account currently authorized for this connector is the user’s configured Google Workspace account. The connector should be disabled or its account authorization revoked when the task no longer needs access.

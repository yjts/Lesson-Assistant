# Local Draft Backup and Support

## What is stored

Lesson Assistant stores drafts in the current browser profile. Drafts can contain lesson topics, teacher edits, and notes. They are not uploaded, synchronized, or available automatically on another device.

Local diagnostics are separate from drafts. The application retains at most 20 entries, each containing only an approved event code, timestamp, and application version. Diagnostics never include lesson inputs, generated text, teacher notes, URLs, account identifiers, or student information.

Open **Support diagnostics** under Saved drafts to inspect these entries. Select **Clear diagnostics** to remove them from the browser.

## Back up and restore

1. In **Saved drafts**, select **Backup**.
2. Store the downloaded JSON file in an approved location.
3. To recover drafts, select **Restore** and choose that JSON file.
4. Restore merges drafts by identity. When both copies have the same identity, the most recently updated copy wins.

Restore accepts supported Lesson Assistant JSON backups up to 5 MB. Larger files are rejected before their contents are read.

Back up before clearing browser data, resetting a browser profile, changing devices, or ending a pilot.

## Browser-storage limitations

- Clearing site data removes drafts and diagnostics from that browser.
- Private browsing may remove data when its session closes.
- Browser profiles and devices do not synchronize drafts.
- Storage quotas and managed-device policies can prevent saving.
- A backup may contain teacher-authored lesson content and should be handled according to school policy.

Do not enter student names, student records, health information, or other sensitive student data in topics or notes.

## Recovery and support

If saving fails, download a backup if the draft list remains available, copy the current lesson text from the printable summary, and record the browser name, browser version, device type, action attempted, visible error text, and approximate time. Do not send lesson content unless an authorized support process explicitly requires it.

The JSON backup is human-readable. Keep an unchanged copy before attempting any manual recovery.

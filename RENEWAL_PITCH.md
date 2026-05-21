# Mythreal Brand Portal — Renewal Pitch & Onboarding Documentation

This document contains the core beta onboarding assets, success metric thresholds, and the precise renewal pitch template designed to prove the operational value of the brand portal toWaypoint at the end of the beta phase.

---

## 1. The Renewal Pitch Template
Pin this exact script for the beta-to-paid conversion meeting:

> [!TIP]
> ### "The Only Sentence That Matters"
>
> **"Your team opened the portal [N] times this month. Colors were copied [N] times. The developer tokens section was accessed [N] times. The portal is now part of how your team ships work."**

*We will gather the exact values for `[N]` by querying the `client_usage_summary` SQL rollup view in Supabase.*

---

## 2. Beta Success Thresholds
Track the weekly engagement metrics against these baseline thresholds. If we are not hitting these by Week 6, the product design requires refinement:

| Success Metric | Target Threshold | Query Target Field |
| :--- | :--- | :--- |
| **Weekly Frequency** | Portal accessed **3+ times** per week | `event_type = 'portal_opened'` |
| **Team Breadth** | **2+ distinct** team members active | `count(distinct user_label)` |
| **Utility Actions** | **3+ copy/download** actions per week | `event_type in ('copied_color', 'downloaded_logo', 'copied_css', 'copied_token_block', 'copied_tone_example')` |
| **Workflow Affinity** | At least **1 operational workflow** depends on it | Developer copy events indicate daily engineering integration |

---

## 3. Onboarding Configuration & Launch Check

### Client Onboarding Profile
- **Client Name**: Waypoint
- **Slug**: `waypoint`
- **Passcode**: `waypoint-vibe-2026`
- **Assigned Space URL**: `https://portal.mythreal.studio/waypoint`
- **Dynamic CSS Variables Block**: Configured in `:root` scope

### Launch Email Template
Copy and dispatch this message to the Waypoint lead:

```markdown
Subject: Your Waypoint Brand Portal is live

Hi [Client Lead Name],

Your private Waypoint brand portal is now live:
URL: https://portal.mythreal.studio/waypoint
Passcode: waypoint-vibe-2026

You can share this with your design and engineering teams. It contains your live colors, responsive vector logos, type spec, active vibe coordinates, and developer-friendly CSS tokens.

I will send a monthly usage report at the end of the month detailing how the asset vault has optimized your team's workflow.

Best,
[Your Name]
```

---

## 4. Querying Weekly Usage Rollups
To pull the metrics needed for the pitch at the end of the month, run the following query inside the Supabase SQL Editor:

```sql
SELECT 
  week, 
  event_type, 
  event_count, 
  unique_users 
FROM client_usage_summary 
WHERE client_id = (SELECT id FROM clients WHERE slug = 'waypoint')
ORDER BY week DESC, event_type;
```

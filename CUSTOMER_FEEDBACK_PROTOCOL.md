# Customer Feedback — Working Protocol

**Cedarwings SAS · ISO 13485 §8.2.1**
**Effective 27 May 2026**

---

## 1. Why this protocol exists

Every Customer Feedback case involves at least two people:

- **Creator** — the person who logged the case (complaint, return, warranty, suggestion, inquiry…)
- **Assignee** — the person responsible for investigating and responding

Without a clear rule for who acts next, cases stall and nobody knows whose turn it is. This protocol guarantees **everyone always knows who must act next**, with zero ambiguity, at zero effort.

---

## 2. The core rule — "ball in court"

Every open case carries a **ball-in-court indicator** (⚽) showing who must do the next thing:

| Chip on screen | Meaning |
|---|---|
| 🔴 **⚽ you** | Your turn — do something |
| 🟢 **⚽ \<name\>** | Their turn — wait for them |

The ball **flips automatically** when someone sends a chat reply:

- Assignee replies → ball goes to the **creator**
- Creator replies → ball goes back to the **assignee**
- A third party comments → ball does **not** flip

**You never have to click anything to reassign the ball. Just sending your chat reply is enough.**

---

## 3. Case lifecycle

```
open  →  in_progress  →  resolved  →  closed
                              ↑          ↓
                              └─ reopen ─┘
```

| Status | What it means | How it gets set |
|---|---|---|
| **open** | New case — assignee has not opened or replied yet | Auto on creation |
| **in_progress** | Assignee has acknowledged (opened the case OR sent a chat reply) | **Automatic** — set on first view or first chat reply by the assignee |
| **resolved** | Assignee has finished their part — awaiting creator to confirm | Assignee clicks **✅ Mark Resolved** |
| **closed** | Creator confirmed and archived | Creator (or Manager) clicks **🔒 Close Case** |
| **reopen** (back to open) | Closed case needs more work | Anyone involved clicks **🔄 Reopen** |

**Why this matters:** when you see a case still tagged `open`, it means the assignee literally has not engaged yet — the first thing they should do is open it. Once `in_progress`, you know somebody is on it.

**Mandatory at creation:** every case MUST have an assignee — either picked directly, or routed via a category that has a routing rule (Settings → Category / Role routing). The form will block save until one is set.

---

## 4. What you do — step by step

### A. If you are the CREATOR

1. Click **+ Log Feedback**. Fill in: type, customer / distributor, doctor, case #, category (if applicable), priority, description.
2. Pick an assignee — or leave blank to let the system auto-route by category to the right role.
3. Use the **chat panel** on the case to discuss with the assignee. Every reply you send flips the ball to them.
4. When the assignee clicks **✅ Mark Resolved**, review what they did.
5. If satisfied → click **🔒 Close Case**. Done.
6. If not satisfied → just reply in the chat — the ball goes back to the assignee automatically.
7. If a previously closed case needs more work → click **🔄 Reopen**.

### B. If you are the ASSIGNEE

1. Open the **⚽ Ball in my court** filter. These are the cases waiting on you, and only these.
2. Open a case. Investigate. Reply in the chat. *Each reply automatically flips the ball back to the creator.*
3. When your part is done, click **✅ Mark Resolved** and enter a short resolution note. The ball flips to the creator to confirm.
4. The creator will either close it (done) or come back with more questions — in which case the ball flips back to you.

### C. If you are MANAGEMENT / FULL ACCESS

- You can **🔒 Close** or **🔄 Reopen** any case regardless of role.
- Use the **👀 Mine — waiting on others** filter to spot stalled cases on your team.
- The chat thread of every case is the audit trail. No need to ask "what happened" — scroll the chat.

---

## 5. Filters you should use daily

| Filter | What it shows | When to use it |
|---|---|---|
| **⚽ Ball in my court** | Open cases where you must act next | Your urgent list — clear this first thing each morning |
| **👀 Mine — waiting on others** | Cases you own where the ball is elsewhere | Your watch list — check periodically; chase if it's been long |
| **📧 Open & unread** | Cases assigned to you that you've never opened | Catch newly assigned items |
| **⏰ My follow-ups due** | Follow-up reminders due now | When you scheduled a follow-up check |

---

## 6. Button reference

| Button | Who can press it | What happens |
|---|---|---|
| **+ Log Feedback** | Anyone with access | Open the create form |
| **👁 View** | Anyone with access | Open the case read-only (auto-marks "seen" if assigned to you) |
| **✏️ Edit** | Creator · Assignee · Manager | Open the edit form |
| **✅ Mark Resolved** | Assignee only | Status → `resolved`, ball flips to creator, prompts for resolution note |
| **🔒 Close Case** | Creator or Manager | Status → `closed`, ball cleared, case archived |
| **🔄 Reopen** | Anyone involved | Resurrect a closed/resolved case → status `open`, ball with assignee |
| **🖨 Print** | Anyone | Print the formal record for the ISO 13485 quality file |
| **✓ Mark Follow-up Done** | Follow-up assignee | Close the follow-up reminder only (case stays as-is) |

---

## 7. Priorities and SLA

| Priority | Response SLA | Examples |
|---|---|---|
| **Critical** | Same day — escalate to manager | Patient safety, regulatory breach |
| **High** | Within 24 h | Quality defect blocking treatment, lost shipment |
| **Medium** | Within 3 business days | Minor fit issue, late delivery query |
| **Low** | Standard queue (≤ 5 business days) | Suggestions, compliments, general inquiries |

---

## 8. Audit trail — what is recorded automatically

Every case keeps a permanent trace of:

- Who created it, when, by whom (`received_by`, `created_at`)
- Who was assigned, every reassignment
- Every chat message (sender, timestamp, body, attachments)
- Every ball-in-court flip (via the chat trigger)
- Who clicked Resolved, when, with what resolution note (`resolved_by`, `resolved_at`, `resolution`)
- Last viewed by / last edited by (with timestamps)
- Follow-up reminders, who marked them done, when
- Investigation fields (Lot/UDI, investigation result, root cause, CAPA link, vigilance flag) — required for ISO 13485 §8.2.1 audit

No edits are silent. No reassignments are anonymous. Everything is timestamped.

---

## 9. Common mistakes (and how to avoid them)

| Don't | Do |
|---|---|
| Reply by Slack / WhatsApp / private email | Reply in the case's chat panel — that's the audit trail |
| Reassign yourself off a case to "drop it" | Use **✅ Mark Resolved** if you've done your part, or chat the creator to discuss |
| Close a case before the creator confirms | The creator (or manager) closes — assignees only **Resolve** |
| Mark Resolved without a note | Always write what you did — it's needed for ISO audit and for the creator to confirm |
| Forget about cases where the ball is with the creator | Check **👀 Mine — waiting on others** at least once a week |

---

## 10. Questions / changes

If a button is missing, a flow feels broken, or you want a new filter — log it in this page as a **Suggestion** type. It will be triaged and discussed.

---

*This document is the canonical workflow for the Customer Feedback module. It is generated from the same source as the in-app Help panel (press the help icon on the page). When the workflow changes, both update at the same time.*

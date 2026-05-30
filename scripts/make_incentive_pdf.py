#!/usr/bin/env python3
"""Dependency-free PDF generator for the Incentive Program guide.
Emits a multi-page A4 PDF using the built-in Helvetica fonts. No third-party
libraries (the environment's fpdf2/reportlab are unavailable)."""

import zlib

# ---- Page / layout geometry (points; A4 = 595 x 842) -------------------------
PW, PH = 595.0, 842.0
ML, MR, MT, MB = 56.0, 56.0, 70.0, 60.0
TOP = PH - MT
USABLE_W = PW - ML - MR

# Approximate Helvetica char widths (per 1000 units) for decent word-wrap.
# Average-ish table keyed by char; default for unknown chars.
def char_w(c, bold):
    base = {' ':278,'.':278,',':278,':':278,';':278,'i':222,'j':222,'l':222,
            'I':278,'t':278,'f':278,'r':333,'(':333,')':333,'m':833,'M':833,
            'W':944,'w':722}
    return base.get(c, 600 if bold else 556)

def text_width(s, size, bold):
    return sum(char_w(c, bold) for c in s) * size / 1000.0

def wrap(text, size, bold, width):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if text_width(trial, size, bold) <= width:
            cur = trial
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines or [""]

def esc(s):
    return s.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")

# ---- Content model -----------------------------------------------------------
# Each block: (kind, text). kinds: h1 h2 h3 p bullet small rule space
BRAND = (0.231, 0.373, 0.886)   # #3b5fe2
DARK  = (0.06, 0.09, 0.16)
MUT   = (0.39, 0.45, 0.55)

doc = [
    ("title", "Cedarwings SAS"),
    ("subtitle", "KPI & Incentive Program — Guide"),
    ("small", "How performance is measured and rewarded across Customer Feedback, Production, Quality Control and Outsourcing."),
    ("rule", ""),

    ("h2", "1. What this program does"),
    ("p", "The KPI & Incentive Center turns the work your team already records into a fair, transparent score for each employee, an accumulated points balance, and a calculated bonus. It covers people who handle customer feedback cases and people who work in production, and it ties product quality back to the person responsible."),
    ("p", "Everything is computed from data already in the system - resolved cases, completed production steps, time sessions, quality controls, complaints and outsourced orders. Nothing has to be entered twice."),

    ("h2", "2. The core idea: Points -> Bonus"),
    ("bullet", "Each employee accumulates POINTS for good output (aligners produced, steps completed, QC passed, cases resolved on time, high efficiency)."),
    ("bullet", "PENALTIES subtract points for problems traced to them (complaints, QC failures, reopened cases, overdue follow-ups)."),
    ("bullet", "NET POINTS = earned points - penalty points."),
    ("bullet", "BONUS = net points x the configured point-value (a currency amount you set, e.g. 0.50 per point), with an optional cap."),
    ("bullet", "A SCORE out of 100 ranks everyone, and a TIER (Gold / Silver / Bronze) is assigned by score thresholds."),

    ("h2", "3. Production employees - how points are earned"),
    ("p", "Productivity and efficiency are measured from production tracking and time sessions:"),
    ("bullet", "Aligners produced - points per aligner."),
    ("bullet", "Production steps completed (Printing, Thermoforming, Line Cut, Laser Marking, Cleaning, Packaging) - points per step."),
    ("bullet", "Efficiency % = productive minutes / (productive + waste + break minutes). Points are earned for efficiency above a floor you set (e.g. above 60%)."),
    ("bullet", "Average cycle time per step is shown to spot bottlenecks."),
    ("bullet", "QC passes performed - points per approved quality control."),

    ("h2", "4. Case handlers - customer feedback"),
    ("p", "People who resolve customer feedback cases earn points for resolution and speed:"),
    ("bullet", "Points per case resolved."),
    ("bullet", "Extra points when a case is resolved within the SLA target (e.g. within 3 days)."),
    ("bullet", "Penalty for overdue follow-ups assigned to them."),

    ("h2", "5. Quality tied back to the person"),
    ("p", "A complaint is traced back to the operator who performed the production step responsible for that complaint category. For example, a 'Packaging' complaint is attributed to whoever did the Packaging step on that order; a 'Fitting' complaint to the Printing/Thermoforming operator. This attribution map is fully editable."),
    ("bullet", "Each traced complaint applies a penalty to the responsible operator."),
    ("bullet", "QC failures and reopened cases also apply penalties."),
    ("p", "This closes the loop: the people whose work generates complaints see it reflected in their score, and the categories driving complaints become visible."),

    ("h2", "6. The QC-before-delivery gate"),
    ("p", "Quality is enforced, not just measured. A case cannot be marked fully completed / ready for delivery unless its Quality Control is APPROVED - covering aligner quality, treatment-plan match, packaging and shipping/documentation."),
    ("bullet", "Enforced in the database, so it cannot be bypassed."),
    ("bullet", "Production shows a clear message if QC is missing, before anything is saved."),
    ("bullet", "A one-click admin kill-switch can disable the gate instantly in an emergency."),

    ("h2", "7. Outsourcing"),
    ("p", "Outsourced orders are tracked per supplier: number of orders, aligners, on-time return rate (returned on or before the expected date) and cost - so supplier performance is comparable at a glance."),

    ("h2", "8. Everything is parametrable"),
    ("p", "Open the configuration panel on the KPI & Incentives page to change, and save, any of the following. Changes persist for all admins and recompute immediately:"),
    ("bullet", "Bonus value (currency per point) and an optional bonus cap."),
    ("bullet", "Points per aligner, per step, per QC pass, per case resolved, per SLA case."),
    ("bullet", "Efficiency floor % and points per efficiency point."),
    ("bullet", "Penalties: per complaint, per QC fail, per reopen, per overdue follow-up."),
    ("bullet", "SLA days and the tier thresholds (Gold / Silver / Bronze)."),
    ("bullet", "The QC-before-delivery gate on/off."),
    ("bullet", "The complaint-category -> production-step attribution map."),

    ("h2", "9. Access & exports"),
    ("bullet", "The report page is restricted to managers / admins / super admins."),
    ("bullet", "Filter by period (This month / Quarter / Year / All)."),
    ("bullet", "Export to CSV, or print / save as PDF directly from the page."),

    ("h2", "10. A worked example"),
    ("p", "An operator produced 40 aligners (40 pts), completed 12 steps (6 pts at 0.5 each), passed 3 QC checks (12 pts), ran at 78% efficiency (above a 60% floor -> 7.2 pts). Earned = 65.2. One packaging complaint was traced to them (-10) and one QC fail (-8). Net = 47.2 points. At 0.50 per point, the bonus = 23.60. Their tier follows their score relative to the team."),
    ("small", "All figures above are illustrative; the actual values come from your configured settings."),

    ("rule", ""),
    ("small", "Cedarwings SAS - KPI & Incentive Program. This guide reflects the program as configured in the application; live values always follow the settings saved on the KPI & Incentives page."),
]

# ---- Renderer ----------------------------------------------------------------
STYLE = {
    "title":   (22, True,  DARK,  10, 6),
    "subtitle":(15, True,  BRAND, 2,  4),
    "h2":      (13, True,  DARK,  14, 6),
    "h3":      (11.5,True, DARK,  8,  4),
    "p":       (10.5,False,DARK,  2,  5),
    "bullet":  (10.5,False,DARK,  1,  4),
    "small":   (8.5, False,MUT,   2,  4),
}
LEADING = 1.42

pages = []        # each page: list of (op-string)
cur = []
y = TOP

def new_page():
    global cur, y
    if cur:
        pages.append(cur)
    cur = []
    y = TOP

def emit_line(s, x, yy, size, bold, color):
    f = "F2" if bold else "F1"
    r,g,b = color
    cur.append(f"BT /{f} {size:.1f} Tf {r:.3f} {g:.3f} {b:.3f} rg 1 0 0 1 {x:.1f} {yy:.1f} Tm ({esc(s)}) Tj ET")

new_page()
for kind, text in doc:
    if kind == "space":
        y -= 8; continue
    if kind == "rule":
        y -= 6
        cur.append(f"0.85 0.88 0.92 RG 0.8 w {ML:.1f} {y:.1f} m {PW-MR:.1f} {y:.1f} l S")
        y -= 10; continue
    size, bold, color, gap_before, gap_after = STYLE[kind]
    y -= gap_before
    indent = ML + (16 if kind == "bullet" else 0)
    width = USABLE_W - (16 if kind == "bullet" else 0)
    lines = wrap(text, size, bold, width)
    for i, ln in enumerate(lines):
        line_h = size * LEADING
        if y - line_h < MB:
            new_page()
        if kind == "bullet" and i == 0:
            emit_line("•", ML + 2, y - size, size, False, BRAND)
        emit_line(ln, indent, y - size, size, bold, color)
        y -= line_h
    y -= gap_after
new_page()  # flush last

# ---- Assemble PDF objects ----------------------------------------------------
objs = []
def add(obj_bytes):
    objs.append(obj_bytes); return len(objs)  # 1-based id

# Reserve: 1 Catalog, 2 Pages, fonts 3 & 4, then page+content pairs
font1 = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"
font2 = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"

# Build content + page objects, collecting page ids
content_ids = []
page_ids = []

# placeholder ids: catalog=1, pages=2, font1=3, font2=4
CATALOG_ID, PAGES_ID, F1_ID, F2_ID = 1, 2, 3, 4
next_id = 5

page_obj_defs = []
content_obj_defs = []
for page_ops in pages:
    stream = ("\n".join(page_ops)).encode("cp1252", "replace")
    comp = zlib.compress(stream)
    cid = next_id; next_id += 1
    content_obj_defs.append((cid, comp))
    pid = next_id; next_id += 1
    page_ids.append(pid)
    page_obj_defs.append((pid, cid))

kids = " ".join(f"{pid} 0 R" for pid in page_ids)

# Now serialize all objects in id order
serial = {}
serial[CATALOG_ID] = f"<< /Type /Catalog /Pages {PAGES_ID} 0 R >>".encode()
serial[PAGES_ID] = (f"<< /Type /Pages /Count {len(page_ids)} /Kids [{kids}] >>").encode()
serial[F1_ID] = font1
serial[F2_ID] = font2
for cid, comp in content_obj_defs:
    serial[cid] = (b"<< /Length " + str(len(comp)).encode() +
                   b" /Filter /FlateDecode >>\nstream\n" + comp + b"\nendstream")
for pid, cid in page_obj_defs:
    serial[pid] = (f"<< /Type /Page /Parent {PAGES_ID} 0 R /MediaBox [0 0 {PW:.0f} {PH:.0f}] "
                   f"/Resources << /Font << /F1 {F1_ID} 0 R /F2 {F2_ID} 0 R >> >> "
                   f"/Contents {cid} 0 R >>").encode()

max_id = next_id - 1
out = bytearray()
out += b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
offsets = {}
for i in range(1, max_id + 1):
    offsets[i] = len(out)
    out += f"{i} 0 obj\n".encode() + serial[i] + b"\nendobj\n"

xref_pos = len(out)
out += f"xref\n0 {max_id+1}\n".encode()
out += b"0000000000 65535 f \n"
for i in range(1, max_id + 1):
    out += f"{offsets[i]:010d} 00000 n \n".encode()
out += (f"trailer\n<< /Size {max_id+1} /Root {CATALOG_ID} 0 R >>\n"
        f"startxref\n{xref_pos}\n%%EOF").encode()

with open("Incentive_Program_Guide.pdf", "wb") as f:
    f.write(out)
print(f"Wrote Incentive_Program_Guide.pdf ({len(out)} bytes, {len(page_ids)} pages)")

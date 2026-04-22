// Cedarwings SAS — Supabase Configuration
// Production project — Pro account
export const SUPABASE_CONFIG = {
  url: 'https://cvrmadmzzualqukxxlro.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cm1hZG16enVhbHF1a3h4bHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0Mjc3MDQsImV4cCI6MjA5MjAwMzcwNH0.KmVRMz17T4f_FKgWSjr9LTh0DIMsJVyOGuC0k-v1BQs'
}

// Document / form reference codes printed at the top of every
// formal report. One edit here updates every generated PDF.
//   - qc        — 16-point QC inspection certificate   (ISO 13485 §8.2.4)
//   - dhr       — Device History Record / Fiche de lot (ISO 13485 §4.2.5 / §7.5.9)
//   - stat_xiii — EU MDR 2017/745 Annex XIII per-device
//                 Declaration of Conformity for custom-made dental aligners
export const CW_DOC_REF = {
  qc:        { code: 'QC-FR-001',  rev: 'Rev.2', iso: 'ISO 13485:2016 §8.2.4 · EN ISO 20795-1',
               titleFR: 'FICHE DE CONTRÔLE QUALITÉ',
               titleEN: 'QUALITY CONTROL RECORD' },
  dhr:       { code: 'DHR-FR-001', rev: 'Rev.1', iso: 'ISO 13485:2016 §4.2.5 / §7.5.9',
               titleFR: 'FICHE DE LOT — DEVICE HISTORY RECORD',
               titleEN: 'BATCH RECORD — DEVICE HISTORY RECORD' },
  stat_xiii: { code: 'STAT-XIII-BLOOMaligner-01', rev: 'Rev.1',
               iso: 'EU MDR 2017/745 Annex XIII · Custom-made devices',
               titleFR: 'DÉCLARATION DE CONFORMITÉ — DISPOSITIF SUR MESURE',
               titleEN: 'DECLARATION OF CONFORMITY — CUSTOM-MADE DEVICE' }
}

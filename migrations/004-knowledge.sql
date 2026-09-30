-- Format-only upgrade: preserve current source facts and Atlas revisions.
ALTER TABLE projects ADD COLUMN purpose TEXT;
ALTER TABLE relations ADD COLUMN evidence_ids TEXT;
CREATE TABLE knowledge_records (
  project_id TEXT NOT NULL REFERENCES projects(id),
  kind TEXT NOT NULL CHECK(kind IN ('evidenceRecords','actors','rules','areas','journeys','glossary')),
  id TEXT NOT NULL,
  data TEXT NOT NULL,
  PRIMARY KEY(project_id,kind,id)
);

CREATE TABLE history (project_id TEXT NOT NULL REFERENCES projects(id), revision INTEGER NOT NULL, snapshot TEXT NOT NULL, PRIMARY KEY(project_id,revision));

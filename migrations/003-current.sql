UPDATE features
SET data = json_remove(data, '$.comparison')
WHERE json_extract(data, '$.scene.kind') = 'booking';
DROP TABLE history;

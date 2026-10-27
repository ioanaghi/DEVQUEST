import { executeSeasonSql } from './sql.mjs';
process.once('message', (input) => {
  try {
    process.send({ result: executeSeasonSql(input) });
  } catch (e) {
    process.send({ error: e.message });
  }
});

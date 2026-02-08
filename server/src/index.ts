import cors from 'cors';
import dotenv from 'dotenv';
import express, { json } from 'express';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});




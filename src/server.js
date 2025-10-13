import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';

const PORT = process.env.PORT || 10000; // ✅ changed default to 10000

app.listen(PORT, () => {
  console.log(`✅ API running on port ${PORT}`);
});

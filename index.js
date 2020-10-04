import express from 'express';
import gradesRouter from './routes/gradesRouter.js';
const app = express();
app.use(express.json());

app.use('/grades', gradesRouter);

app.listen(3000, () => {
  console.log('stated');
});

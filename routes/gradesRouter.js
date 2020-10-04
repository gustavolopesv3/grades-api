import express from 'express';
import { promises as fs } from 'fs';
const { readFile, writeFile } = fs;
const router = express.Router();

//criar novo
router.post('/', async (req, res) => {
  try {
    let newGrade = req.body;
    const data = JSON.parse(await readFile('models/grades.json'));
    newGrade = { id: data.nextId, ...newGrade };
    data.nextId++;
    data.grades.push(newGrade);
    await writeFile('models/grades.json', JSON.stringify(data, null, 2));
    res.send(newGrade);
    console.log('pass');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//buscar por ID
router.get('/:id', async (req, res) => {
  console.log('chamada');
  try {
    const data = JSON.parse(await readFile('models/grades.json'));
    const grade = data.grades.find(
      (reqGrade) => reqGrade.id === parseInt(req.params.id)
    );
    res.send(grade);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//atulizar grade
router.put('/', async (req, res) => {
  try {
    let updateGrade = req.body;
    const data = JSON.parse(await readFile('models/grades.json'));
    const index = data.grades.findIndex((a) => a.id === updateGrade.id);
    data.grades[index] = updateGrade;
    await writeFile('models/grades.json', JSON.stringify(data, null, 2));
    res.send(updateGrade);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// deletar grade
router.delete('/:id', async (req, res) => {
  console.log('chamado');
  try {
    const data = JSON.parse(await readFile('models/grades.json'));
    data.grades = data.grades.filter((grade) => {
      return grade.id !== parseInt(req.params.id);
    });
    await writeFile('models/grades.json', JSON.stringify(data, null, 2));
    res.end('deletado');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//buscar por student e subject e realizar soma
router.get('/:student/:subject', async (req, res) => {
  console.log('somando');
  try {
    const data = await readFile('models/grades.json', 'utf8');
    const json = JSON.parse(data);

    const grades = json.grades.filter(({ student, subject } = student) => {
      return student === req.params.student && subject === req.params.subject;
    });

    const sumGrade = grades.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);

    return res.send({ Soma: sumGrade });
  } catch (error) {
    res.status(400).send({ error: err.message });
  }
});
export default router;

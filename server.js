const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const host = 'localhost';
const port = 8000;

// настройка для обслуживания статических файлов из 'public'
// путь в html-файле - '/css/my.css'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // middleware для разбора JSON-запросов

// TODO - GET
app.get('/rest/players', async (req, res) => {

  try {
    const contents = await fs.readFile(path.join(__dirname, 'views', 'index.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(contents);
  } catch (err) {
    res.status(500).send(err);
  }
  
});

// TODO - GET
app.get('/rest/players/data', async (req, res) => {

  try {
    const data = await fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch data' });
  }
  
});

// TODO - DELETE
app.delete('/rest/players/:playerName', async (req, res) => {

  try {
    const playerName = decodeURIComponent(req.params.playerName);
    const dataPath = path.join(__dirname, 'data', 'data.json');
    const data = await fs.readFile(dataPath, 'utf8');
    const jsonData = JSON.parse(data);

    // Находим индекс игрока по имени
    const playerIndex = jsonData.findIndex((player) => player.Name === playerName);

    if (playerIndex !== -1) {
      // Удаляем игрока из массива данных
      jsonData.splice(playerIndex, 1);

      // Перезаписываем обновленные данные в файл
      await fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8');
      res.status(204).send();      
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
    
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete data' });
  }
    
});

// TODO - POST
app.post('/rest/players', async (req, res) => {
  const newPlayer = req.body;
  
  try {
    const data = await fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8');
    const jsonData = JSON.parse(data);

    // Добавляем нового игрока в массив данных
    jsonData.push(newPlayer);

    // Запись обновленных данных обратно в файл
    await fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(jsonData, null, 2), 'utf8');

    res.status(201).json(newPlayer); // Успешное добавление
  } catch (err) {
    res.status(500).json({ error: "Unable to add player" });
  }
    
});


app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});


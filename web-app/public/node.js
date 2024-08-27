const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json()); // To parse JSON bodies

// Define the path to CSV file
const csvFilePath = path.join(__dirname, 'testdata.csv');

// Endpoint to receive data and append to CSV
app.post('/api/server', (req, res) => {
  const answers = req.body.answers; // Assuming JSON body { answers: { questionIndex: answerValue, ... } }

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  // Convert answers object to CSV format
  const csvRows = Object.entries(answers).map(([questionIndex, answerValue]) => `${questionIndex},${answerValue}`);
  const csvData = csvRows.join('\n') + '\n';

  // Append to CSV file
  fs.appendFile(csvFilePath, csvData, (err) => {
    if (err) {
      console.error('Error writing to CSV file:', err);
      return res.status(500).json({ error: 'Failed to write to CSV file' });
    }
    res.json({ message: 'Data appended to CSV successfully!' });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


import './App.css'

import { useState } from 'react';
import clipboardy from 'clipboardy';
import moment from 'moment';


function App() {
  const [text, setText] = useState('');
  function transformToPairs(text: any) {
    // Separar el texto en líneas
    const lines = text.split('\n');

    // Eliminar las líneas que contienen "Expected Resolution Date"
    const filteredLines = lines.filter(line => !line.includes("Expected Resolution Date"));

    // Convertir las líneas en pares de arrays de 2 en 2
    const result = [];
    for (let i = 0; i < filteredLines.length; i += 2) {
      result.push([filteredLines[i], filteredLines[i + 1]]);
    }


    const creationDate = moment(result[9][1], 'DD/MM/YYYY hh:mm A').format('DD/MM/YYYY HH:mm');
    const closingDate = moment(result[11][1], 'DD/MM/YYYY hh:mm A').format('DD/MM/YYYY HH:mm');

    const data = [];
    data.push(result[1][1], creationDate, creationDate, closingDate, closingDate, 'Closed', result[7][1], result[8][1]);

    const dataString = data.join('\t');

    return dataString;
  }

  const handleInputChange = (event: any) => {
    setText(event.target.value);
  };

  const handleGenerateClick = () => {
    // Copiar el texto al portapapeles
    clipboardy.write(transformToPairs(text));
    alert('Texto copiado al portapapeles.');
  };

  return (
    <div className="max-w-md mx-auto">
      <textarea
        className="w-full h-40 border border-gray-300 rounded-lg p-2 mb-4"
        placeholder="Ingresa el texto..."
        value={text}
        onChange={handleInputChange}
      ></textarea>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleGenerateClick}
      >
        Generar
      </button>
    </div>
  );
};

export default App;


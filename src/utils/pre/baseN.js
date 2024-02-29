import clipboardy from "clipboardy";
import moment from "moment";

const text = `Incidence No.
NI-19790
Line ID
PER.TDP.1708555594517
Case Type
Network
Case Name
FE-1038748822
Subject
FE-1038748822
Reason
Error de asignación
SubReason
Error en asignación
Diagnosis
Predial sin preasignación
Solution
Nueva preasignación
Creation Date
23/02/2024 01:43 PM
Expected Resolution Date
Date / Time of Solution
26/02/2024 04:55 pm
Closing Date / Time
26/02/2024 04:55 pm
Time Elapsed
3 Days, 3 Hours, 12 Minutes, 9 Seconds
Customer
1 - Telefónica del Perú
Description
ASIGNACION: preasignado DIRECCION DEL PEDIDO: JR CAMANA 950 URB CERCADO DE LIMA CASA na PI 2 UR INT 216 XY DE LA DIRECCION CORRECTA: -77.03700012 ; -12.05199314 FFTT QUE TECNICO DESEA: WAG3320316`;











export function transformToPairs(text) {
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



// const resultado = transformToPairs(text);

// const creationDate = moment(resultado[9][1], 'DD/MM/YYYY hh:mm A').format('DD/MM/YYYY HH:mm');
// const closingDate = moment(resultado[11][1], 'DD/MM/YYYY hh:mm A').format('DD/MM/YYYY HH:mm');

// const data = [];
// data.push(resultado[1][1], creationDate, creationDate, closingDate, closingDate, 'Closed', resultado[7][1], resultado[8][1]);

// Convertir los valores de data en una cadena de texto separada por comas
// const dataString = data.join('\t');

// Copiar la cadena de texto al portapapeles
clipboardy.writeSync(transformToPairs(text));

console.log('Los valores han sido copiados al portapapeles.');

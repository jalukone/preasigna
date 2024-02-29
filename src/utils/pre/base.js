import puppeteer from "puppeteer";
import clipboardy from "clipboardy";
import { readFile, writeFile } from 'fs/promises';
import { password } from "./password.js";
import { log } from "console";

const results = [];
const USER = 'gerson.salas@fibernaascusp01.onmicrosoft.com'
const PASSWORD = password

// PARA PRE A SIGNAS

const loadSession = async (proyect) => {

  function extraerValorNumerico(cadena) {
    // Utilizamos una expresión regular para extraer los dígitos numéricos
    const matches = cadena.match(/\d+/);

    // Verificamos si se encontraron coincidencias
    if (matches) {
      // Devolvemos el valor numérico como un número entero
      return parseInt(matches[0], 10).toString();
    }

    // En caso de no encontrar dígitos numéricos, devolvemos null o algún valor predeterminado según tus necesidades
    return null;
  }

  const ticket = extraerValorNumerico(proyect)

  try {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 60,
      args: ["--start-maximized"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 900, isMobile: false, isLandscape: true, hasTouch: false, deviceScaleFactor: 1 });


    // Lee las cookies guardadas desde el archivo
    const cookies = JSON.parse(await readFile("./src/utils/pre/session/cookies.json"));

    // Establece las cookies en la página
    await page.setCookie(...cookies);


    await page.goto("https://cxmportal.pangeaco.pe/#/crm-home");
    // await page.type("#email", USER);
    // await page.type("#password", PASSWORD);
    // await page.click("#next");

    await page.waitForSelector(".blz-controls-application-container-content", { visible: true, timeout: 11000 });
    await page.click("#blz-widget-10035-45")
    await page.click("#blz-widget-10037-47")
    await page.waitForSelector("#blz-repeater-10214-44-body", { visible: true, timeout: 15000 });
    await page.click("#blz-button-10249-79")
    await page.type("#blz-control-numeric-box-10262-92-ctrl", ticket)
    await page.click("#blz-button-10273-13")
    await page.$eval(".blz-area-brief", elem => (elem).click());
    await page.click(".sd-text-align-right div")


    // await page.type("#blz-control-textbox-10230-60-ctrl", proyect)
    // await page.keyboard.press("Enter");


    const datos = await page.$$eval("#blz-repeater-component-10334-74 div div div div", (elements) => {
      return elements.map((element) => element.textContent);
    });
    // Helper function to clean up whitespace
    const cleanWhitespace = (str) => str.trim().replace(/\s+/g, ' ');

    // Helper function to generate id
    let currentId = 1;
    const generateId = () => currentId++;

    // Process the inputArray
    const processedData = [];
    for (let i = 0; i < datos.length; i += 5) {
      const id = generateId();
      const label = cleanWhitespace(datos[i]);
      const value = cleanWhitespace(datos[i + 4]);
      processedData.push({ id, label, value });
    }

    // Extract 'value' based on specified 'id' order
    const desiredIds = [2, 10, 13, 8, 9];
    const resultArray = desiredIds.map((desiredId) => {
      const foundItem = processedData.find((item) => item.id === desiredId);
      return foundItem ? foundItem.value : null;
    });

    /////////////
    // Función para formatear la fecha y hora a un nuevo formato
    const formatDateTime = (dateTimeString) => {
      const [date, time, period] = dateTimeString.split(' ');
      const formattedDate = date.split('/').reverse().join('/');
      const [hour, minutes] = time.split(':');
      const formattedHour = (period === 'PM' || period === 'pm') ? (parseInt(hour, 10) + 12).toString().padStart(2, '0') : hour.padStart(2, '0');
      const formattedTime = `${formattedHour}:${minutes}`;
      return [formattedDate, formattedTime];
    };

    // // Procesar cada elemento del arreglo
    // const processedArray = resultArray.flatMap((item, index) => {
    //   // Separar la fecha y la hora para los elementos de las posiciones 1 y 2
    //   if (index === 1 || index === 2) {
    //     return formatDateTime(item);
    //   }
    //   // Mantener los demás elementos sin cambios
    //   return item;
    // });

    // console.log(processedArray);
    console.log(datos)



    // Cerar navegador
    // await browser.close();

  } catch (error) {
    log("Se produjo un error: ", error)
  }


}

const inputs = []
loadSession('NI-12677');


// Ejecutar la función para cada input
const runLoadSessionForInputs = async () => {
  let i = 0;
  for (const input of inputs) {

    await loadSession(input);
    i++;
    log(i)
  }

  // Copiar los resultados al portapapeles con saltos de línea
  clipboardy.writeSync(results.join("\n"));
};

// Ejecutar la función
// runLoadSessionForInputs();


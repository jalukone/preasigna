import puppeteer from "puppeteer";
import clipboardy from "clipboardy";
import { readFile, writeFile } from 'fs/promises';
import { password } from "./password.js";
import { log } from "console";

const results = [];

const loadSession = async (proyect) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
      args: ["--start-maximized"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 900, isMobile: false, isLandscape: true, hasTouch: false, deviceScaleFactor: 1 });

    // Lee las cookies guardadas desde el archivo
    const cookies = JSON.parse(await readFile("./session/cookies.json"));

    // Establece las cookies en la página
    await page.setCookie(...cookies);

    // Abre la página con la sesión restaurada
    await page.goto("https://wfm.pangeaco.pe/workorders/projects/search");
    const titleToFind = proyect;

    // await page.waitForSelector(".jss216", { visible: true });

    while (true) {
      try {
        await page.waitForSelector(".jss180", { visible: true, timeout: 35000 }); // Aumentar el tiempo a 60 segundos
        break; // Salir del bucle si tiene éxito
      } catch (error) {
        console.log("No se encontró el selector 1. Volviendo a intentar...");
        page.reload();
        // Puedes agregar un pequeño retraso antes de volver a intentar si es necesario
        // Esperar 5 segundos antes de volver a intentar
      }
    }

    await page.type(".jss99", "X");
    await page.keyboard.press("Enter");
    await page.type(".jss242 input", proyect);
    await page.keyboard.press("Enter");

    // await page.waitForSelector(`div[title="${titleToFind}"]`, { visible: true });

    while (true) {
      try {
        await page.waitForSelector(`div[title="${titleToFind}"]`, { visible: true, timeout: 6000 }); // Aumentar el tiempo a 60 segundos
        break; // Salir del bucle si tiene éxito
      } catch (error) {
        console.log("No se encontró el selector 2. Volviendo a intentar...");

        // Puedes agregar un pequeño retraso antes de volver a intentar si es necesario
        // Esperar 5 segundos antes de volver a intentar
      }
    }


    await page.click(`div[title="${titleToFind}"]`);

    // Identificar el input
    // await page.waitForSelector(".jss396", { visible: true });

    while (true) {
      try {
        await page.waitForSelector(".jss396", { visible: true, timeout: 10000 }); // Aumentar el tiempo a 60 segundos
        break; // Salir del bucle si tiene éxito
      } catch (error) {
        console.log("No se encontró el selector 3. Volviendo a intentar...");
        page.reload();
        // Puedes agregar un pequeño retraso antes de volver a intentar si es necesario
        // Esperar 5 segundos antes de volver a intentar
      }
    }


    // Selecciona todos los elementos <input> dentro del contenedor específico
    const homeIdLineIdCto = await page.$$eval(".MuiGrid-container input", (inputElements) => {
      return inputElements.map((element) => element.value);
    });


    // Valores de reasignacion
    // await page.waitForSelector(".jss444", { visible: true })
    await page.click(".jss447");

    // await page.waitForSelector(".jss623", { visible: true });

    while (true) {
      try {
        await page.waitForSelector(".jss486", { visible: true, timeout: 9000 }); // Aumentar el tiempo a 60 segundos
        break; // Salir del bucle si tiene éxito
      } catch (error) {
        console.log("No se encontró el selector 4. Volviendo a intentar...");
        page.reload();
        // Puedes agregar un pequeño retraso antes de volver a intentar si es necesario
        // Esperar 5 segundos antes de volver a intentar
      }
    }

    // log('testing')
    // await page.waitForNavigation({ timeout: 120000 })

    // Selecciona todos los elementos <input> dentro del contenedor específico
    // await page.waitForNavigation({ timeout: 40000 })
    const projectIdworkId = await page.$$eval(".MuiGrid-root.jss494.MuiGrid-container.MuiGrid-spacing-xs-2 input", (inputElements) => {
      return inputElements.map((element) => element.value);
    });

    // log(projectIdworkId)

    const activityComments = await page.$$eval("span.jss586.jss593", (elements) => {
      return elements.map((element) => element.textContent);
    });


    const nameUser = await page.$$eval(".jss591 strong", (elements) => {
      return elements.map((element) => element.textContent);
    });
    // console.log(nameUser[nameUser.length - 3]);

    let name = "";

    switch (nameUser[nameUser.length - 3]) {
      case 'ivan.ccahuachia@fibernaas.onmicrosoft.com':
        name = 'Gerson Salas';
        break;

      case 'luis.jesus@cisetel.com':
        name = 'JESUS CRISTOBAL';
        break;
      case 'alonso.fernandez@cisetel.com':
        name = 'Alonso Fernandez';
        break;

      // case 'hans.morales@cisetel.com':
      //   name = 'Brudy Espinoza';
      //   break;
      case 'hans.morales@cisetel.com':
        name = 'Hans Morales';
        break;

    }

    console.log(name);



    let createDate = "";
    let finishDate = "";
    if (activityComments.length >= 2) {
      createDate = activityComments[0].match(/\d{1,2}:\d{2} [AP]M/g)[0];
      finishDate = activityComments[activityComments.length - 1].match(/\d{1,2}:\d{2} [AP]M/g)[0];
    }

    let description = "";
    let typeIn = "";

    // Verificar si la variable es numérica usando parseInt
    if (!isNaN(parseInt(homeIdLineIdCto[5]))) {
      description = ""
      typeIn = "Preasignación"
    } else {
      description = "No presenta Home ID"
      typeIn = "Radial"
    }


    const cto = homeIdLineIdCto[10] == 'null' ? "---" : homeIdLineIdCto[10];

    const data = [projectIdworkId[2], projectIdworkId[0], homeIdLineIdCto[5], homeIdLineIdCto[7], homeIdLineIdCto[9], cto,
      "02/12/2023", createDate, "02/12/2023", finishDate, name, description, typeIn];


    // // Formatea los valores con tabulaciones
    // const tabSeparatedData = data.join("\t");

    // // Copia los valores al portapapeles
    // clipboardy.writeSync(tabSeparatedData);

    results.push(data.join("\t"));



    // Cerar navegador
    // await browser.close();

  } catch (error) {
    log("Se produjo un error: ", error)
  }

}

const inputs =
  ["0xc07e407-RM"]

loadSession('0xc7e73ab-RM');


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


import puppeteer from "puppeteer";
import clipboardy from "clipboardy";
import { readFile, writeFile } from 'fs/promises';
import { password } from "./password.js";
import { log } from "console";


const loadSession = async (proyect) => {
  const browser = await puppeteer.launch({
    // headless: false,
    // slowMo: 50,
    // args: ["--start-maximized"],
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

  await page.waitForSelector(".jss216", { visible: true });
  await page.type(".jss99", "X");
  await page.keyboard.press("Enter");
  await page.type(".jss234 input", proyect);
  await page.keyboard.press("Enter");

  await page.waitForSelector(`div[title="${titleToFind}"]`, { visible: true });
  await page.click(`div[title="${titleToFind}"]`);

  // Identificar el input
  await page.waitForSelector(".jss396", { visible: true });

  // Selecciona todos los elementos <input> dentro del contenedor específico
  const homeIdLineIdCto = await page.$$eval(".MuiGrid-container input", (inputElements) => {
    return inputElements.map((element) => element.value);
  });


  // Valores de reasignacion
  await page.click(".jss444");

  await page.waitForSelector(".jss623", { visible: true });
  // Selecciona todos los elementos <input> dentro del contenedor específico
  const projectIdworkId = await page.$$eval(".MuiGrid-root.jss491.MuiGrid-container.MuiGrid-spacing-xs-2 input", (inputElements) => {
    return inputElements.map((element) => element.value);
  });


  const activityComments = await page.$$eval("span.jss583.jss590", (elements) => {
    return elements.map((element) => element.textContent);
  });


  const nameUser = await page.$$eval(".jss588 strong", (elements) => {
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

  // Verificar si la variable es numérica usando parseInt
  if (!isNaN(parseInt(homeIdLineIdCto[5]))) {
    description = ""
  } else {
    description = "No presenta Home ID"
  }


  const cto = homeIdLineIdCto[10] == 'null' ? "---" : homeIdLineIdCto[10];

  const data = [projectIdworkId[2], projectIdworkId[0], homeIdLineIdCto[5], homeIdLineIdCto[7], homeIdLineIdCto[9], cto,
    "25/10/2023", createDate, "25/10/2023", finishDate, name, description];


  // Formatea los valores con tabulaciones
  const tabSeparatedData = data.join("\t");

  // Copia los valores al portapapeles
  clipboardy.writeSync(tabSeparatedData);




  // Cerar navegador
  await browser.close();

}



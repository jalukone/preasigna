import puppeteer from "puppeteer";
import clipboardy from "clipboardy";
import { readFile, writeFile } from 'fs/promises';
import { password } from "./password.js";
import { log } from "console";

const results = [];
const USER = 'gerson.salas@fibernaascusp01.onmicrosoft.com'
const PASSWORD = password

// PARA STATUS BSS

const loadSession = async (proyect) => {
  try {
    const browser = await puppeteer.launch({
      // headless: false,
      slowMo: 45,
      // args: ["--start-maximized"],
    });

    const page = await browser.newPage();
    // await page.setViewport({ width: 1600, height: 900, isMobile: false, isLandscape: true, hasTouch: false, deviceScaleFactor: 1 });


    // Lee las cookies guardadas desde el archivo
    const cookies = JSON.parse(await readFile("./src/utils/pre/session/cookies.json"));

    // Establece las cookies en la página
    await page.setCookie(...cookies);


    await page.goto("https://cxmportal.pangeaco.pe/#/crm-home");
    // await page.type("#email", USER);
    // await page.type("#password", PASSWORD);
    // await page.click("#next");

    await page.waitForSelector(".blz-controls-application-container-content", { visible: true, timeout: 11000 });
    await page.click("#blz-widget-10012-22")
    await page.click("#blz-widget-10014-24")
    await page.type("#blz-control-textbox-10230-60-ctrl", proyect)
    await page.keyboard.press("Enter");

    const status = await page.$$eval(".blz-margin-left-small.blz-bold", (element) => {
      return element.map((el) => el.textContent);
    })

    log(status[0])




    const data = [status[0]];


    results.push(data.join("\t"));



    // Cerar navegador
    await browser.close();

  } catch (error) {
    log("Se produjo un error: ", error)
  }


}

const inputs = ["PER.TDP.1701102796313", "PER.TDP.1701106027566", "PER.TDP.1701110760720", "PER.TDP.1701112547235", "PER.TDP.1701118262379", "PER.TDP.1701118962749", "PER.TDP.1701182933816", "PER.TDP.1701207055137", "PER.TDP.1701215265123", "PER.TDP.1701219886269", "PER.TDP.1701219945468", "PER.TDP.1701274612323", "PER.TDP.1701285447926", "PER.TDP.1701289776615", "PER.TDP.1701291220697", "PER.TDP.1701297744563", "PER.TDP.1701298176950", "PER.TDP.1701302979178", "PER.TDP.1701303527789", "PER.TDP.1701361500602", "PER.TDP.1701383098497", "PER.TDP.1701387346986", "PER.TDP.1701394718024", "PER.TDP.1701396590946", "PER.TDP.1701480892558", "PER.TDP.1701534970487", "PER.TDP.1701535375934", "PER.TDP.1701538240460", "PER.TDP.1701547671714", "PER.TDP.1701549588433", "PER.TDP.1701554641467", "PER.TDP.1701621049758", "PER.TDP.1701708161747", "PER.TDP.1701723180605", "PER.TDP.1701732036095", "PER.TDP.1701771675133", "PER.TDP.1701796079085", "PER.TDP.1701804303960", "PER.TDP.1701814755651", "PER.TDP.1701821627654", "PER.TDP.1701872101070", "PER.TDP.1701874318747", "PER.TDP.1701875056014", "PER.TDP.1701877978380", "PER.TDP.1701880020174", "PER.TDP.1701880870899", "PER.TDP.1701885110001", "PER.TDP.1701886728212", "PER.TDP.1701895066404", "PER.TDP.1701902622290", "PER.TDP.1701903953128"]

// loadSession('PER.TDP.1683240783076');


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
runLoadSessionForInputs();


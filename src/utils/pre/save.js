import puppeteer from "puppeteer";
import clipboardy from "clipboardy";
import { readFile, writeFile } from 'fs/promises';
import { password } from "./password.js";
import { log } from "console";



const USER = 'gerson.salas@fibernaascusp01.onmicrosoft.com'
const PASSWORD = password

// console.log(USER, PASSWORD);
const saveSession = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 70,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1000, isMobile: false, isLandscape: true, hasTouch: false, deviceScaleFactor: 1 });
  await page.goto("https://cxmportal.pangeaco.pe/#/crm-home");
  await page.type("#email", USER);
  await page.type("#password", PASSWORD);
  await page.click("#next");
  // await page.keyboard.press("Enter");
  // await page.waitForNavigation({ delay: 100 });
  // await page.goto("https://wfm.pangeaco.pe/workorders/search");
  // await page.keyboard.press("Enter");
  await page.waitForSelector(".blz-controls-application-container-content", { visible: true, timeout: 22000 });


  // Cookies
  const cookies = await page.cookies();
  await writeFile("./src/utils/pre/session/cookies.json", JSON.stringify(cookies, null, 2))



  await browser.close();



}

saveSession()
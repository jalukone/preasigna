import puppeteer from "puppeteer";
import clipboardy from "clipboardy";
import { readFile, writeFile } from 'fs/promises';
import { password } from "./password.js";
import { log } from "console";



const USER = 'ivan.ccahuachia@fibernaas.onmicrosoft.com'
const PASSWORD = password
// console.log(USER, PASSWORD);
const saveSession = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1000, isMobile: false, isLandscape: true, hasTouch: false, deviceScaleFactor: 1 });
  await page.goto("https://wfm.pangeaco.pe/workorders/search");
  await page.click(".MuiCardActions-root button");
  await page.waitForNavigation();
  await page.type("#i0116", USER);
  await page.keyboard.press("Enter");
  await page.waitForNavigation();
  await page.type("#i0118", PASSWORD);
  await page.keyboard.press("Enter");
  await page.waitForNavigation();
  await page.click("#KmsiCheckboxField")
  await page.keyboard.press("Enter");
  await page.waitForNavigation({ delay: 100 });
  // await page.goto("https://wfm.pangeaco.pe/workorders/search");
  // await page.keyboard.press("Enter");
  // await page.waitForNavigation();


  // Cookies
  const cookies = await page.cookies();
  await writeFile("./session/cookies.json", JSON.stringify(cookies, null, 2))



  await browser.close();



}

saveSession()
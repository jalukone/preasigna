import { writeFile } from 'fs/promises';
import { clipboardy } from "clipboardy";
import { log } from "console";
import { PuppeteerService } from "./services/PuppeteerService";
import { Project } from "./models/Project";
import { User } from "./models/User";

const results: string[] = [];
const puppeteerService = new PuppeteerService();

const projects: Project[] = [
  new Project("Proyecto1", "0x9f7e531-RM"),
  new Project("Proyecto2", "0x9f7eca9-RM"),
  // Agrega más proyectos si es necesario
];

const runLoadSessionForProjects = async () => {
  let i = 0;
  for (const project of projects) {
    const browser = await puppeteerService.startBrowser();
    const result = await puppeteerService.loadSession(project.id, browser);
    results.push(result);
    await puppeteerService.closeBrowser(browser);
    i++;
    log(i);
  }

  clipboardy.writeSync(results.join("\n"));
};

runLoadSessionForProjects();

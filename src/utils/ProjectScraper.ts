import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';
import clipboardy from 'clipboardy';
import { readFile } from 'fs/promises';

class ProjectDataExtractor {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private results: string[] = [];

  constructor() {}

  public async loadSession(projectId: string): Promise<void> {
    this.browser = await puppeteer.launch({
      // Configuración de lanzamiento
    });
    this.page = await this.browser.newPage();

    await this.loadCookies();
    await this.navigateToProjectPage(projectId);
    const projectData = await this.extractProjectData();

    this.results.push(projectData.join('\t'));

    await this.closeBrowser();
  }

  private async loadCookies(): Promise<void> {
    try {
      const bufferData = await readFile('./session/cookies.json');
      const cookies = JSON.parse(bufferData.toString());
      if (this.page) {
        await this.page.setCookie(...cookies);
      }
    } catch (error) {
      console.error('Error al cargar cookies:', error);
    }
  }

  private async navigateToProjectPage(projectId: string): Promise<void> {
    if (this.page) {
      await this.page.goto('https://wfm.pangeaco.pe/workorders/projects/search');
      await this.waitForSelectorWithRetry('.jss216');
      await this.page.type('.jss99', 'X');
      await this.page.keyboard.press('Enter');
      await this.page.type('.jss234 input', projectId);
      await this.page.keyboard.press('Enter');
      await this.waitForSelectorWithRetry(`div[title="${projectId}"]`);
      await this.page.click(`div[title="${projectId}"]`);
      await this.waitForSelectorWithRetry('.jss396');
    }
  }

  private async extractProjectData(): Promise<string[]> {
    const homeIdLineIdCto = await this.extractInputValues(".MuiGrid-container input");
    await this.page?.click('.jss444');
    await this.waitForSelectorWithRetry('.jss623');

    const projectIdworkId = await this.extractInputValues(".MuiGrid-root.jss491.MuiGrid-container.MuiGrid-spacing-xs-2 input");
    const activityComments = await this.extractTextValues('span.jss583.jss590');
    const name = this.resolveNameUser(activityComments);

    const createDate = this.extractCreateDate(activityComments);
    const finishDate = this.extractFinishDate(activityComments);
    const description = this.resolveDescription(homeIdLineIdCto);
    const typeIn = this.resolveTypeIn(homeIdLineIdCto);

    const cto = homeIdLineIdCto[10] === 'null' ? '---' : homeIdLineIdCto[10];

    return [projectIdworkId[2], projectIdworkId[0], homeIdLineIdCto[5], homeIdLineIdCto[7], homeIdLineIdCto[9], cto, '30/10/2023', createDate, '30/10/2023', finishDate, name, description, typeIn];
  }

  private async extractInputValues(selector: string): Promise<string[]> {
    const elements = await this.page?.$$<ElementHandle<HTMLInputElement>>(selector);
    return elements.map((element) => element.value);
  }

  private async extractTextValues(selector: string): Promise<string[]> {
    const elements = await this.page?.$$<ElementHandle>(selector);
    return elements.map((element) => element.textContent || '');
  }

  private resolveNameUser(activityComments: string[]): string {
    const lastUserEmail = activityComments[activityComments.length - 3];
    switch (lastUserEmail) {
      case 'ivan.ccahuachia@fibernaas.onmicrosoft.com':
        return 'Gerson Salas';
      case 'luis.jesus@cisetel.com':
        return 'JESUS CRISTOBAL';
      case 'alonso.fernandez@cisetel.com':
        return 'Alonso Fernandez';
      case 'hans.morales@cisetel.com':
        return 'Hans Morales';
      default:
        return '';
    }
  }

  private extractCreateDate(activityComments: string[]): string {
    if (activityComments.length >= 2) {
      const createDateMatch = activityComments[0].match(/\d{1,2}:\d{2} [AP]M/g);
      return createDateMatch ? createDateMatch[0] : '';
    }
    return '';
  }

  private extractFinishDate(activityComments: string[]): string {
    if (activityComments.length >= 2) {
      const finishDateMatch = activityComments[activityComments.length - 1].match(/\d{1,2}:\d{2} [AP]M/g);
      return finishDateMatch ? finishDateMatch[0] : '';
    }
    return '';
  }

  private resolveDescription(homeIdLineIdCto: string[]): string {
    if (!isNaN(parseInt(homeIdLineIdCto[5]))) {
      return '';
    } else {
      return 'No presenta Home ID';
    }
  }

  private resolveTypeIn(homeIdLineIdCto: string[]): string {
    if (!isNaN(parseInt(homeIdLineIdCto[5]))) {
      return 'Preasignación';
    } else {
      return 'Radial';
    }
  }

  private async waitForSelectorWithRetry(selector: string, maxRetries = 5): Promise<void> {
    if (!this.page) return;

    let retryCount = 0;
    while (retryCount < maxRetries) {
      try {
        await this.page.waitForSelector(selector, { visible: true });
        return;
      } catch (error) {
        console.log(`No se encontró el selector ${selector}. Intento ${retryCount + 1}. Volviendo a intentar...`);
        this.page.reload();
        retryCount++;
      }
    }
  }

  private async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }

  public getResults(): string[] {
    return this.results;
  }
}

// Lista de proyectos
const inputs: string[] = ['0x9a4f555-RM', /* otros proyectos */];

const runLoadSessionForInputs = async () => {
  const projectDataExtractor = new ProjectDataExtractor();

  for (const input of inputs) {
    try {
      await projectDataExtractor.loadSession(input);
      const results = projectDataExtractor.getResults();
      console.log('Resultados:', results);
    } catch (error) {
      console.error('Se produjo un error al cargar la sesión:', error);
    }
  }
};

runLoadSessionForInputs();

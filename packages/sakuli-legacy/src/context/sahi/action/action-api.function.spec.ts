import {By, ThenableWebDriver} from "selenium-webdriver";
import { getTestBrowserList } from "../__mocks__/get-browser-list.function";
import { actionApi } from "./action-api.function";
import { AccessorUtil } from "../accessor";
import { RelationsResolver } from "../relations";
import { createTestEnv, TestEnvironment, createTestExecutionContextMock, mockHtml } from "../__mocks__";


jest.setTimeout(25_000);
describe('action-api', () => {

    describe.each(getTestBrowserList())('%s', (browser: "firefox" | "chrome", local: boolean) => {

        let env: TestEnvironment;
        let driver: ThenableWebDriver;
        beforeAll(async () => {
            console.log(browser);
            env = createTestEnv(browser, local);
            await env.start();
            driver = (await env.getEnv()).driver;
        });

        function createApi(driver: ThenableWebDriver) {
            const ctx = createTestExecutionContextMock();
            return actionApi(driver,
                new AccessorUtil(
                    driver,
                    ctx,
                    new RelationsResolver(driver, ctx)
                ),
                ctx
            )
        }

        afterEach(async () => {
            try {
                await driver.actions({bridge: true}).clear();
            } catch(e) {
                console.log('Actions are not cleaned because ', e);
            }
        });

        afterAll(async () => {
            await env.stop();
        });

        describe('auto scroll to viewport', () => {
            it('should autoscroll to click element', async () => {
                const api = createApi(driver);
                await driver.get(mockHtml(`
                    <div style="display: block; width: 100%; height: 150vh; background: red"></div>
                    <button id="btn">Click Me</button>
                    <script>
                    
                    </script>
                `))
                //await expect(driver.findElement(By.css('#btn')).click()).resolves.toBeNull();
                await expect(api._click({
                    locator: By.css('#btn'),
                    identifier: 0,
                    relations: []
                })).resolves.toBeUndefined();

                if(browser === 'firefox') {
                    await new Promise(res => setTimeout(res, 15000));
                }
            })
        })

    });
});

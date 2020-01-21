import { WebElement } from "selenium-webdriver";
import { TestExecutionContext } from "@sakuli/core";

export async function scrollIntoViewIfNeeded(element: WebElement, ctx: TestExecutionContext): Promise<void> {
    if(!element){
        ctx.logger.debug("scroll into view failed: element was null or undefined");
        return Promise.resolve();
    }
    ctx.logger.trace(`scroll into view started with element: ${element}`);
    return element.getDriver().executeScript<void>(`
        return arguments[0].scrollIntoView({
            inline: "center",
            block: "center"
        });
    `, element).catch((): void => {});
}

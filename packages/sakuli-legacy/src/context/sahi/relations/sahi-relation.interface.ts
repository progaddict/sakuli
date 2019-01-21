import {WebElement} from "selenium-webdriver";

/**
 * A Sahi relation is basically a mapping operation between two WebElement-Arrays
 * Usually it is produced by a higher order function wich injects some context to it.
 * <code>
 *     function _in(element: WebElement) {
 *         return async (elements: WebElement[]) {
 *             return Promise.all(elements.map(...))
 *         }
 *     }
 * </code>
 */
export type SahiRelation = (elements: WebElement[]) => Promise<WebElement[]>;

export type RelationProducer = (anchorElement: WebElement) => SahiRelation;
export type RelationProducerWithOffset = (anchorElement: WebElement, offset?: number) => SahiRelation;
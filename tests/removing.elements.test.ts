import { IsometricCanvas, IsometricPath } from '../mod.ts';
import {
    describe,
    it,
    assertEquals
} from "./deps.ts";
describe('Removing methods', { sanitizeOps: false }, (): void => {

    let container: HTMLDivElement;

    it('Removing elements and checking their statuses', (): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        const cube = new IsometricCanvas({
            container,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        const top = new IsometricPath();
        const right = new IsometricPath();
        const left = new IsometricPath();

        top.moveTo(0, 0, 1).lineTo(1, 0, 1).lineTo(1, 1, 1).lineTo(0, 1, 1);
        right.moveTo(1, 0, 1).lineTo(1, 0, 0).lineTo(1, 1, 0).lineTo(1, 1, 1);
        left.moveTo(1, 1, 1).lineTo(1, 1, 0).lineTo(0, 1, 0).lineTo(0, 1, 1);
        cube.addChildren(top, right, left);

        const svgElement = cube.getElement();
        const topElement = top.getElement();
        const rightElement = right.getElement();
        const leftElement = left.getElement();

        assertEquals(topElement.parentNode, svgElement);
        assertEquals(rightElement.parentNode, svgElement);
        assertEquals(leftElement.parentNode, svgElement);

        cube.removeChild(top);

        assertEquals(topElement.parentNode, null);

        cube.removeChildByIndex(0);

        assertEquals(rightElement.parentNode, null);

        // Clear IsometricCanvas
        cube.clear();

        assertEquals(leftElement.parentNode, null);

        cube.addChildren(top, right, left);

        cube.removeChildren(top, right, left);

        assertEquals(topElement.parentNode, null);
        assertEquals(rightElement.parentNode, null);
        assertEquals(leftElement.parentNode, null);

        // Clear IsometricPath
        left.clear();
        assertEquals(leftElement.getAttribute('d'), '');

        // Removing wrong elements should not throw errors
        cube.removeChild(top);

        cube.addChild(top);
        topElement.parentNode!.removeChild(topElement);
        cube.removeChild(top);

        cube.removeChildByIndex(10);
    });

});
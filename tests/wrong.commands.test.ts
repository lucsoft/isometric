import {
    describe,
    it,
    assertEquals
} from "./deps.ts";
import { IsometricCanvas, IsometricPath } from '../src/index.ts';

describe('Wrong drawing commands', { sanitizeOps: false }, (): void => {

    let container: HTMLDivElement;

    it('Using no valid drawing commands', (): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        const cube = new IsometricCanvas({ container });

        const top = new IsometricPath();

        cube.addChild(top);
        const topElement = top.getElement();

        top.draw('B1 0 0 X1 1 0 Y1 1 0.25 B1 0.5 0.25 U1 0.5 1 P1 0 1');

        assertEquals(topElement.getAttribute('d'), '');

    });

    it('Start a line without a moving point', (): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        const cube = new IsometricCanvas({ container });

        const top = new IsometricPath();

        cube.addChild(top);

        top.draw('L 1 1 1');

        const topElement = top.getElement();

        assertEquals(topElement.getAttribute('d'), 'M320 240 L320 240z');

    });

    it('Start a curve without a moving point', (): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        const cube = new IsometricCanvas({ container });

        const top = new IsometricPath();

        cube.addChild(top);

        top.draw('C 1 1 1 2 2 2');

        const topElement = top.getElement();

        assertEquals(topElement.getAttribute('d'), 'M320 240 A 0 0 0 0 0 320 240z');
    });

});
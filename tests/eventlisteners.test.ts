import { IsometricCanvas, IsometricPath } from '../mod.ts';
import {
    describe,
    it,
    beforeEach,
    afterEach,
    spy,
    assertSpyCalls,
    assertEquals
} from "./deps.ts";
describe('Test event listeners', { sanitizeOps: false }, (): void => {

    let container: HTMLDivElement;
    let cube: IsometricCanvas;
    let top: IsometricPath;
    let svgElement: SVGElement;
    let topElement: SVGElement;

    beforeEach((): void => {

        container = document.createElement('div');
        document.body.appendChild(container);

        cube = new IsometricCanvas({
            container,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        top = new IsometricPath();

        top.moveTo(0, 0, 1).lineTo(1, 0, 1).lineTo(1, 1, 1).lineTo(0, 1, 1);
        cube.addChild(top);

        svgElement = cube.getElement();
        topElement = top.getElement();

    });

    afterEach((): void => {
        if (container.parentNode && container.parentNode === document.body) {
            document.body.removeChild(container);
        }
    });

    it('IsometricCanvas event listeners', (): void => {

        const mockCallBack = spy();

        cube.addEventListener('click', mockCallBack, true);

        const event = document.createEvent('SVGEvents');
        event.initEvent('click', true, true);

        svgElement.dispatchEvent(event);
        assertEquals(mockCallBack.calls[ 0 ].args[ 0 ].target, svgElement)

        cube.removeEventListener('click', mockCallBack, true);

        svgElement.dispatchEvent(event);
        assertSpyCalls(mockCallBack, 1);

        cube.addEventListener('click', mockCallBack);
        cube.removeEventListener('click', mockCallBack);

        svgElement.dispatchEvent(event);

        assertSpyCalls(mockCallBack, 1);
    });

    it('IsometricPath event listeners', (): void => {

        const mockCallBack = spy();

        top.addEventListener('click', mockCallBack, true);

        const event = document.createEvent('SVGEvents');
        event.initEvent('click', true, true);

        topElement.dispatchEvent(event);

        assertEquals(mockCallBack.calls[ 0 ].args[ 0 ].target, topElement);

        top.removeEventListener('click', mockCallBack, true);

        topElement.dispatchEvent(event);

        assertSpyCalls(mockCallBack, 1);

        top.addEventListener('click', mockCallBack);
        top.removeEventListener('click', mockCallBack);

        topElement.dispatchEvent(event);

        assertSpyCalls(mockCallBack, 1);
    });

    it('Remove event listeners that have not been added', (): void => {

        const mockCallBack = spy();
        const mockCallBackNotAdded = spy();

        cube.addEventListener('click', mockCallBack);
        top.addEventListener('click', mockCallBack);

        // Remove an event listsner that doesn't exist should not throw an error
        cube.removeEventListener('click', mockCallBackNotAdded);

        // Remove an event listsner that doesn't exist should not throw an error
        top.removeEventListener('click', mockCallBackNotAdded);
    });

});
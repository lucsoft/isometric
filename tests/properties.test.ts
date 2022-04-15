import {
    IsometricCanvas,
    IsometricRectangle,
    IsometricCircle,
    IsometricPath,
    IsometricGraphicProps,
    PlaneView
} from '../mod.ts';
import {
    describe,
    it,
    assertEquals,
    beforeEach,
    afterEach,
    assert
} from "./deps.ts";
describe('Test properties', { sanitizeOps: false }, (): void => {

    const containerID = 'container';
    const containerSelector = `#${containerID}`;
    let container: HTMLDivElement;
    let cube: IsometricCanvas;
    let path: IsometricPath;
    let rectangle: IsometricRectangle;
    let circle: IsometricCircle;
    let svgElement: SVGSVGElement;
    let pathElement: SVGElement;
    let rectangleElement: SVGElement;
    let circleElement: SVGElement;

    beforeEach((): void => {

        container = document.createElement('div');
        container.id = containerID;
        document.body.appendChild(container);

        const commonProps: IsometricGraphicProps = {
            fillColor: '#FFF',
            fillOpacity: 0.5,
            strokeColor: '#000',
            strokeDashArray: [ 1, 2, 3 ],
            strokeLinecap: 'round',
            strokeLinejoin: 'miter',
            strokeOpacity: 0.25,
            strokeWidth: 2
        };

        cube = new IsometricCanvas({
            container: containerSelector,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        path = new IsometricPath(commonProps);

        rectangle = new IsometricRectangle({
            height: 1,
            width: 1,
            planeView: PlaneView.TOP,
            ...commonProps
        });

        circle = new IsometricCircle({
            radius: 0.5,
            planeView: PlaneView.TOP,
            ...commonProps
        });

        path.moveTo(0, 0, 0).lineTo(1, 0, 0).lineTo(1, 1, 0).lineTo(0, 1, 0);
        cube.addChildren(path, rectangle, circle);

        svgElement = cube.getElement();
        pathElement = path.getElement();
        rectangleElement = rectangle.getElement();
        circleElement = circle.getElement();

    });

    afterEach((): void => {
        if (container.parentNode && container.parentNode === document.body) {
            document.body.removeChild(container);
        }
    });

    it('IsometricCanvas properties', (): void => {

        assertEquals(cube.backgroundColor, '#CCC');
        assertEquals(cube.scale, 120);
        assertEquals(cube.height, 320);
        assertEquals(cube.width, 500);

        const rect = svgElement.querySelector('rect:first-child') as SVGRectElement;

        assert(rect);

        assertEquals(rect.getAttribute('fill'), '#CCC');
        assertEquals(rect.getAttribute('height'), '320px');
        assertEquals(rect.getAttribute('width'), '500px');
        assertEquals(svgElement.getAttribute('height'), '320px');
        assertEquals(svgElement.getAttribute('width'), '500px');

        cube.backgroundColor = '#EEE';
        cube.scale = 100;
        cube.height = 480;
        cube.width = 640;

        assertEquals(cube.backgroundColor, '#EEE');
        assertEquals(cube.scale, 100);
        assertEquals(cube.height, 480);
        assertEquals(cube.width, 640);

        assertEquals(rect.getAttribute('fill'), '#EEE');
        assertEquals(rect.getAttribute('height'), '480px');
        assertEquals(rect.getAttribute('width'), '640px');
        assertEquals(svgElement.getAttribute('height'), '480px');
        assertEquals(svgElement.getAttribute('width'), '640px');

        assertEquals(cube.animated, true);
        cube.pauseAnimations();
        assertEquals(cube.animated, false);
        cube.resumeAnimations();
        assertEquals(cube.animated, true);

    });

    it('Compare IsometricPath vs IsometricRectangle', (): void => {

        assertEquals(path.fillColor, rectangle.fillColor);
        assertEquals(path.fillOpacity, rectangle.fillOpacity);
        assertEquals(path.strokeColor, rectangle.strokeColor);
        assertEquals(path.strokeDashArray, rectangle.strokeDashArray);
        assertEquals(path.strokeLinecap, rectangle.strokeLinecap);
        assertEquals(path.strokeLinejoin, rectangle.strokeLinejoin);
        assertEquals(path.strokeOpacity, rectangle.strokeOpacity);
        assertEquals(path.strokeWidth, rectangle.strokeWidth);

        assertEquals(pathElement.getAttribute('d'), rectangleElement.getAttribute('d'));

    });

    it('Compare IsometricPath vs IsometricCircle', (): void => {

        assertEquals(path.fillColor, circle.fillColor);
        assertEquals(path.fillOpacity, circle.fillOpacity);
        assertEquals(path.strokeColor, circle.strokeColor);
        assertEquals(path.strokeDashArray, circle.strokeDashArray);
        assertEquals(path.strokeLinecap, circle.strokeLinecap);
        assertEquals(path.strokeLinejoin, circle.strokeLinejoin);
        assertEquals(path.strokeOpacity, circle.strokeOpacity);
        assertEquals(path.strokeWidth, circle.strokeWidth);

    });

    it('IsometricRectangle change position', (): void => {

        rectangle.planeView = PlaneView.TOP;
        assertEquals(rectangleElement.getAttribute('d'), 'M250 160 L353.923 220 L250 280 L146.077 220z');

        rectangle.planeView = PlaneView.FRONT;
        assertEquals(rectangleElement.getAttribute('d'), 'M250 160 L146.077 220 L146.077 100 L250 40z');

        rectangle.planeView = PlaneView.SIDE;
        assertEquals(rectangleElement.getAttribute('d'), 'M250 160 L353.923 220 L353.923 100 L250 40z');

        rectangle.planeView = PlaneView.TOP;
        rectangle.width = 2;
        assertEquals(rectangle.width, 2);
        assertEquals(rectangleElement.getAttribute('d'), 'M250 160 L457.846 280 L353.923 340 L146.077 220z');

        rectangle.height = 2;
        assertEquals(rectangle.height, 2);
        assertEquals(rectangleElement.getAttribute('d'), 'M250 160 L457.846 280 L250 400 L42.154 280z');

        rectangle.clear();
        assertEquals(rectangleElement.getAttribute('d'), '');
        rectangle.update();
        assertEquals(rectangleElement.getAttribute('d'), 'M250 160 L457.846 280 L250 400 L42.154 280z');

    });

    it('IsometricCircle change position', (): void => {

        circle.planeView = PlaneView.TOP;
        assertEquals(circleElement.getAttribute('d'), 'M198.0385 190 A 73.484658 42.426407 0 0 0 301.9615 130 A 73.484658 42.426407 180 0 0 198.0385 190z');

        circle.planeView = PlaneView.FRONT;
        assertEquals(circleElement.getAttribute('d'), 'M198.0385 190 A 73.484684 42.426392 119.999977 0 0 301.9615 130 A 73.484684 42.426392 -60.000023 0 0 198.0385 190z');

        circle.planeView = PlaneView.SIDE;
        assertEquals(circleElement.getAttribute('d'), 'M198.0385 130 A 73.484684 42.426392 60.000023 0 0 301.9615 190 A 73.484684 42.426392 -119.999977 0 0 198.0385 130z');

        circle.planeView = PlaneView.TOP;
        circle.radius = 1;
        assertEquals(circle.radius, 1);
        assertEquals(circleElement.getAttribute('d'), 'M146.077 220 A 146.969316 84.852814 0 0 0 353.923 100 A 146.969316 84.852814 180 0 0 146.077 220z');

        circle.clear();
        assertEquals(circleElement.getAttribute('d'), '');
        circle.update();
        assertEquals(circleElement.getAttribute('d'), 'M146.077 220 A 146.969316 84.852814 0 0 0 353.923 100 A 146.969316 84.852814 180 0 0 146.077 220z');

    });

    it('IsometricPath properties', (): void => {

        assertEquals(path.fillColor, '#FFF');
        assertEquals(path.fillOpacity, 0.5);
        assertEquals(path.strokeColor, '#000');
        assertEquals(path.strokeDashArray, [ 1, 2, 3 ]);
        assertEquals(path.strokeLinecap, 'round');
        assertEquals(path.strokeLinejoin, 'miter');
        assertEquals(path.strokeOpacity, 0.25);
        assertEquals(path.strokeWidth, 2);
        assert(path.autoclose);

        assertEquals(pathElement.getAttribute('fill'), '#FFF');
        assertEquals(pathElement.getAttribute('fill-opacity'), '0.5');
        assertEquals(pathElement.getAttribute('stroke'), '#000');
        assertEquals(pathElement.getAttribute('stroke-dasharray'), '1 2 3');
        assertEquals(pathElement.getAttribute('stroke-linecap'), 'round');
        assertEquals(pathElement.getAttribute('stroke-linejoin'), 'miter');
        assertEquals(pathElement.getAttribute('stroke-opacity'), '0.25');
        assertEquals(pathElement.getAttribute('stroke-width'), '2');
        assert(pathElement.getAttribute('d')!.endsWith('z'));

        path.fillColor = '#000';
        path.fillOpacity = 1;
        path.strokeColor = '#FFF';
        path.strokeDashArray = [ 3, 2, 1 ];
        path.strokeLinecap = 'butt';
        path.strokeLinejoin = 'bevel';
        path.strokeOpacity = 0.75;
        path.strokeWidth = 1;
        path.autoclose = false;

        assertEquals(path.fillColor, '#000');
        assertEquals(path.fillOpacity, 1);
        assertEquals(path.strokeColor, '#FFF');
        assertEquals(path.strokeDashArray, [ 3, 2, 1 ]);
        assertEquals(path.strokeLinecap, 'butt');
        assertEquals(path.strokeLinejoin, 'bevel');
        assertEquals(path.strokeOpacity, 0.75);
        assertEquals(path.strokeWidth, 1);
        assert(!path.autoclose);

        assertEquals(pathElement.getAttribute('fill'), '#000');
        assertEquals(pathElement.getAttribute('fill-opacity'), '1');
        assertEquals(pathElement.getAttribute('stroke'), '#FFF');
        assertEquals(pathElement.getAttribute('stroke-dasharray'), '3 2 1');
        assertEquals(pathElement.getAttribute('stroke-linecap'), 'butt');
        assertEquals(pathElement.getAttribute('stroke-linejoin'), 'bevel');
        assertEquals(pathElement.getAttribute('stroke-opacity'), '0.75');
        assertEquals(pathElement.getAttribute('stroke-width'), '1');
        assert(!pathElement.getAttribute('d')!.endsWith('z'));

    });

    it('IsometricRectangle properties', (): void => {

        assertEquals(rectangle.fillColor, '#FFF');
        assertEquals(rectangle.fillOpacity, 0.5);
        assertEquals(rectangle.strokeColor, '#000');
        assertEquals(rectangle.strokeDashArray, [ 1, 2, 3 ]);
        assertEquals(rectangle.strokeLinecap, 'round');
        assertEquals(rectangle.strokeLinejoin, 'miter');
        assertEquals(rectangle.strokeOpacity, 0.25);
        assertEquals(rectangle.strokeWidth, 2);

        assertEquals(rectangleElement.getAttribute('fill'), '#FFF');
        assertEquals(rectangleElement.getAttribute('fill-opacity'), '0.5');
        assertEquals(rectangleElement.getAttribute('stroke'), '#000');
        assertEquals(rectangleElement.getAttribute('stroke-dasharray'), '1 2 3');
        assertEquals(rectangleElement.getAttribute('stroke-linecap'), 'round');
        assertEquals(rectangleElement.getAttribute('stroke-linejoin'), 'miter');
        assertEquals(rectangleElement.getAttribute('stroke-opacity'), '0.25');
        assertEquals(rectangleElement.getAttribute('stroke-width'), '2');

        rectangle.fillColor = '#000';
        rectangle.fillOpacity = 1;
        rectangle.strokeColor = '#FFF';
        rectangle.strokeDashArray = [ 3, 2, 1 ];
        rectangle.strokeLinecap = 'butt';
        rectangle.strokeLinejoin = 'bevel';
        rectangle.strokeOpacity = 0.75;
        rectangle.strokeWidth = 1;

        assertEquals(rectangle.fillColor, '#000');
        assertEquals(rectangle.fillOpacity, 1);
        assertEquals(rectangle.strokeColor, '#FFF');
        assertEquals(rectangle.strokeDashArray, [ 3, 2, 1 ]);
        assertEquals(rectangle.strokeLinecap, 'butt');
        assertEquals(rectangle.strokeLinejoin, 'bevel');
        assertEquals(rectangle.strokeOpacity, 0.75);
        assertEquals(rectangle.strokeWidth, 1);

        assertEquals(rectangleElement.getAttribute('fill'), '#000');
        assertEquals(rectangleElement.getAttribute('fill-opacity'), '1');
        assertEquals(rectangleElement.getAttribute('stroke'), '#FFF');
        assertEquals(rectangleElement.getAttribute('stroke-dasharray'), '3 2 1');
        assertEquals(rectangleElement.getAttribute('stroke-linecap'), 'butt');
        assertEquals(rectangleElement.getAttribute('stroke-linejoin'), 'bevel');
        assertEquals(rectangleElement.getAttribute('stroke-opacity'), '0.75');
        assertEquals(rectangleElement.getAttribute('stroke-width'), '1');

    });

});
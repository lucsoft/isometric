import {
    IsometricCanvas,
    IsometricRectangle,
    IsometricCircle,
    IsometricPath,
    PlaneView,
    Axis
} from '../mod.ts';
import { Texture } from '../src/@types/index.ts';
import {
    afterEach,
    beforeEach,
    describe,
    it,
    assert,
    assertEquals
} from "./deps.ts";

const PATH_COMMANDS = 'M1 1 0.5 L0 1 1 L0 0 1 L1 0 0.5';

describe('Test textures', { sanitizeOps: false }, (): void => {

    const containerID = 'container';
    const containerSelector = `#${containerID}`;

    let container: HTMLDivElement;
    let isometric: IsometricCanvas;
    let path: IsometricPath;

    let isometricElement: SVGElement;
    let pathElement: SVGElement;

    let pathPattern: SVGPatternElement;

    const texture = {
        url: '/images/texture.png',
        height: 1,
        width: 1
    };

    beforeEach((): void => {

        container = document.createElement('div');
        container.id = containerID;
        document.body.appendChild(container);

        isometric = new IsometricCanvas({
            container: containerSelector,
            backgroundColor: '#CCC',
            scale: 120,
            width: 500,
            height: 320
        });

        isometricElement = isometric.getElement();

    });

    afterEach((): void => {
        if (container.parentNode && container.parentNode === document.body) {
            document.body.removeChild(container);
        }
    });

    it('Check pattern', () => {

        path = new IsometricPath({
            texture
        });

        path.draw(PATH_COMMANDS);

        isometric.addChild(path);

        pathPattern = path.getPattern();

        assert(isometricElement.contains(pathPattern));
        assertEquals(pathPattern.getAttribute('preserveAspectRatio'), 'none');
        assertEquals(pathPattern.getAttribute('patternUnits'), 'userSpaceOnUse');
        assertEquals(pathPattern.getAttribute('height'), '120');
        assertEquals(pathPattern.getAttribute('width'), '120');

        isometric.removeChild(path);

        path = new IsometricPath({
            texture: {
                url: texture.url
            }
        });

        path.draw(PATH_COMMANDS);

        isometric.addChild(path);

        pathPattern = path.getPattern();

        assertEquals(pathPattern.getAttribute('height'), '100%');
        assertEquals(pathPattern.getAttribute('width'), '100%');

    });

    it('Check pattern image', () => {

        // Check basic image attributes
        path = new IsometricPath({
            texture
        });

        path.draw(PATH_COMMANDS);

        isometric.addChild(path);

        pathPattern = path.getPattern()!;

        assert(pathPattern.firstChild);
        assertEquals(pathPattern.childNodes.length, 1);
        assertEquals(pathPattern.firstChild.nodeName, 'image');

        let image = pathPattern.firstChild as SVGImageElement;

        assertEquals(image.getAttribute('preserveAspectRatio'), 'none');
        assertEquals(image.getAttribute('href'), '/images/texture.png');
        assertEquals(image.getAttribute('x'), '0');
        assertEquals(image.getAttribute('y'), '0');
        assertEquals(image.getAttribute('height'), '120');
        assertEquals(image.getAttribute('width'), '120');
        assertEquals(image.style.imageRendering, '');

        isometric.removeChild(path);

        // Check style pixelated
        path = new IsometricPath({
            texture: {
                ...texture,
                pixelated: true
            }
        });

        path.draw(PATH_COMMANDS);

        isometric.addChild(path);

        pathPattern = path.getPattern();
        image = pathPattern.firstChild as SVGImageElement;

        assertEquals(image.style.imageRendering, 'pixelated');

        isometric.removeChild(path);

        // Check image without sizes
        path = new IsometricPath({
            texture: {
                url: texture.url
            }
        });

        path.draw(PATH_COMMANDS);

        isometric.addChild(path);

        pathPattern = path.getPattern();
        assert(pathPattern)
        image = pathPattern.firstChild as SVGImageElement;

        assertEquals(image.getAttribute('height'), '100%');
        assertEquals(image.getAttribute('width'), '100%');

    });

    it('Check fill url', () => {

        path = new IsometricPath({
            texture
        });

        path.draw(PATH_COMMANDS);

        isometric.addChild(path);

        pathElement = path.getElement();
        pathPattern = path.getPattern();

        assertEquals(pathElement.getAttribute('fill'), `url(#${pathPattern.id}) white`);

        path.fillColor = '#EFEFEF';

        assertEquals(pathElement.getAttribute('fill'), `url(#${pathPattern.id}) #EFEFEF`);

    });

    it('Check transforms', () => {

        // Transform in paths without drawings
        path = new IsometricPath({
            texture
        });

        isometric.addChild(path);

        pathPattern = path.getPattern();
        assertEquals(pathPattern.getAttribute('patternTransform'), 'translate(9007199254740991 9007199254740991)');

        isometric.removeChild(path);

        const tests = [
            // Transform in paths with drawings
            {
                texture,
                value: 'translate(146.077 100)'
            },
            // Transform in paths with scale
            {
                texture: {
                    ...texture,
                    scale: 0.5
                },
                value: 'translate(146.077 100) scale(0.5)'
            },
            // Transform in paths with shifts top
            {
                texture: {
                    ...texture,
                    shift: { top: 1 }
                },
                value: 'translate(146.077 -20)'
            },
            // Transform in paths with shifts right
            {
                texture: {
                    ...texture,
                    shift: { right: 1 }
                },
                value: 'translate(250 160)'
            },
            // Transform in paths with shifts left
            {
                texture: {
                    ...texture,
                    shift: { left: 1 }
                },
                value: 'translate(42.154 160)'
            },
            // Transform in paths with shifts neutral
            {
                texture: {
                    ...texture,
                    shift: { right: 1, left: 1, top: 1 }
                },
                value: 'translate(146.077 100)'
            },
            // Transform in paths with plane-view top
            {
                texture: {
                    ...texture,
                    planeView: PlaneView.TOP
                },
                value: 'translate(146.077 100) matrix(0.707107,-0.408248,0.707107,0.408248,0,0) scale(1.224745)'
            },
            // Transform in paths with plane-view side
            {
                texture: {
                    ...texture,
                    planeView: PlaneView.SIDE
                },
                value: 'translate(146.077 100) matrix(0.707107,0.408248,0,0.816496,0,0) scale(1.224745)'
            },
            // Transform in paths with plane-view front
            {
                texture: {
                    ...texture,
                    planeView: PlaneView.FRONT
                },
                value: 'translate(146.077 100) matrix(0.707107,-0.408248,0,0.816496,0,0) scale(1.224745)'
            },
            // Transform in paths with plane-view and scale
            {
                texture: {
                    ...texture,
                    planeView: PlaneView.TOP,
                    scale: 0.5
                },
                value: 'translate(146.077 100) matrix(0.707107,-0.408248,0.707107,0.408248,0,0) scale(0.612372)'
            }
        ];

        tests.forEach((props) => {

            path = new IsometricPath({
                texture: props.texture
            });

            path.draw(PATH_COMMANDS);

            isometric.addChild(path);

            pathPattern = path.getPattern();
            assertEquals(pathPattern.getAttribute('patternTransform'), props.value);

            isometric.removeChild(path);

        });

    });

    it('Check texture rotations', () => {

        const tests = [
            {
                planeView: PlaneView.TOP,
                rotationAxis: Axis.TOP,
                rotationValue: 45,
                expect: 'translate(146.077 220) matrix(1.000001,0,0,0.57735,0,0) scale(1.224745)'
            },
            {
                planeView: PlaneView.TOP,
                rotationAxis: Axis.RIGHT,
                rotationValue: -30,
                expect: 'translate(146.077 220) matrix(0.612372,-0.761802,0.707107,0.408248,0,0) scale(1.224745)'
            },
            {
                planeView: PlaneView.TOP,
                rotationAxis: Axis.LEFT,
                rotationValue: 30,
                expect: 'translate(146.077 220) matrix(0.707107,-0.408248,0.612372,0.761802,0,0) scale(1.224745)'
            },
            {
                planeView: PlaneView.SIDE,
                rotationAxis: Axis.TOP,
                rotationValue: -30,
                expect: 'translate(250 40) matrix(0.965925,0.149429,0,0.816496,0,0) scale(1.224745)'
            },
            {
                planeView: PlaneView.SIDE,
                rotationAxis: Axis.RIGHT,
                rotationValue: 30,
                expect: 'translate(250 40) matrix(0.707107,0.408248,-0.353553,0.911231,0,0) scale(1.224745)'
            },
            {
                planeView: PlaneView.SIDE,
                rotationAxis: Axis.LEFT,
                rotationValue: -30,
                expect: 'translate(250 40) matrix(0.612372,-0.054695,0.353554,0.91123,0,0) scale(1.224745)'
            },
            {
                planeView: PlaneView.FRONT,
                rotationAxis: Axis.TOP,
                rotationValue: 30,
                expect: 'translate(146.077 100) matrix(0.965925,-0.149429,0,0.816496,0,0) scale(1.224745)'
            },
            {
                planeView: PlaneView.FRONT,
                rotationAxis: Axis.RIGHT,
                rotationValue: -30,
                expect: 'translate(146.077 100) matrix(0.612372,-0.761801,0.353553,0.502982,0,0) scale(1.224745)'
            },
            {
                planeView: PlaneView.FRONT,
                rotationAxis: Axis.LEFT,
                rotationValue: -30,
                expect: 'translate(146.077 100) matrix(0.707107,-0.408248,0.353553,0.911231,0,0) scale(1.224745)'
            },
            //Check wrong rotation axis
            {
                planeView: PlaneView.TOP,
                rotationAxis: 'none' as Axis,
                rotationValue: 30,
                expect: 'translate(146.077 220) matrix(0.707107,-0.408248,0.707107,0.408248,0,0) scale(1.224745)'
            },
            {
                planeView: PlaneView.SIDE,
                rotationAxis: 'none' as Axis,
                rotationValue: 30,
                expect: 'translate(250 40) matrix(0.707107,0.408248,0,0.816496,0,0) scale(1.224745)'
            },
            {
                planeView: PlaneView.FRONT,
                rotationAxis: 'none' as Axis,
                rotationValue: 30,
                expect: 'translate(146.077 100) matrix(0.707107,-0.408248,0,0.816496,0,0) scale(1.224745)'
            },
            // Check wrong planeview
            {
                planeView: PlaneView.TOP,
                rotationPlaneView: 'none' as PlaneView,
                rotationAxis: 'none' as Axis,
                rotationValue: 30,
                expect: 'translate(146.077 220)'
            }
        ];

        tests.forEach((test) => {

            const rectangle = new IsometricRectangle({
                planeView: test.planeView,
                height: 1,
                width: 1,
                texture: {
                    ...texture,
                    planeView: test.rotationPlaneView,
                    rotation: {
                        axis: test.rotationAxis,
                        value: test.rotationValue
                    }
                }
            });

            isometric.addChild(rectangle);

            const rectanglePattern = rectangle.getPattern();
            assert(rectanglePattern);
            assertEquals(rectanglePattern.getAttribute('patternTransform'), test.expect);

        });

    });

    it('Check rectangle transform', () => {

        // Top plane-view
        let rectangle = new IsometricRectangle({
            planeView: PlaneView.TOP,
            height: 1,
            width: 1,
            texture
        });

        isometric.addChild(rectangle);

        let patternRectangle = rectangle.getPattern();

        assert(patternRectangle)
        assertEquals(patternRectangle.getAttribute('patternTransform'), 'translate(146.077 220) matrix(0.707107,-0.408248,0.707107,0.408248,0,0) scale(1.224745)');

        isometric.removeChild(rectangle);

        // Side plane-view
        rectangle = new IsometricRectangle({
            planeView: PlaneView.SIDE,
            height: 1,
            width: 1,
            texture
        });

        isometric.addChild(rectangle);

        patternRectangle = rectangle.getPattern();

        assert(patternRectangle)
        assertEquals(patternRectangle.getAttribute('patternTransform'), 'translate(250 40) matrix(0.707107,0.408248,0,0.816496,0,0) scale(1.224745)');

        isometric.removeChild(rectangle);

        // Front plane-view
        rectangle = new IsometricRectangle({
            planeView: PlaneView.FRONT,
            height: 1,
            width: 1,
            texture
        });

        isometric.addChild(rectangle);

        patternRectangle = rectangle.getPattern();

        assert(patternRectangle)
        assertEquals(patternRectangle.getAttribute('patternTransform'), 'translate(146.077 100) matrix(0.707107,-0.408248,0,0.816496,0,0) scale(1.224745)');

        isometric.removeChild(rectangle);

    });

    it('Check circle transform', () => {

        // Top plane-view
        let circle = new IsometricCircle({
            planeView: PlaneView.TOP,
            radius: 0.5,
            texture
        });

        isometric.addChild(circle);

        let patternCircle = circle.getPattern();

        assert(patternCircle)
        assertEquals(patternCircle.getAttribute('patternTransform'), 'translate(198.0385 190) matrix(0.707107,-0.408248,0.707107,0.408248,0,0) scale(1.224745)');

        isometric.removeChild(circle);

        // Side plane-view
        circle = new IsometricCircle({
            planeView: PlaneView.SIDE,
            radius: 0.5,
            texture
        });

        isometric.addChild(circle);

        patternCircle = circle.getPattern();

        assertEquals(patternCircle.getAttribute('patternTransform'), 'translate(198.0385 130) matrix(0.707107,0.408248,0,0.816496,0,0) scale(1.224745)');

        isometric.removeChild(circle);

        // Front plane-view
        circle = new IsometricCircle({
            planeView: PlaneView.FRONT,
            radius: 0.5,
            texture
        });

        isometric.addChild(circle);

        patternCircle = circle.getPattern();

        assert(patternCircle)
        assertEquals(patternCircle.getAttribute('patternTransform'), 'translate(198.0385 190) matrix(0.707107,-0.408248,0,0.816496,0,0) scale(1.224745)');

        isometric.removeChild(circle);

    });

    it('Check pattern removal', () => {

        path = new IsometricPath({
            texture
        });

        path.draw(PATH_COMMANDS);

        isometric.addChildren(path);

        pathPattern = path.getPattern();

        isometric.removeChildren(path);

        assert(!isometricElement.contains(pathPattern));

    });

    it('Check texture property', () => {

        path = new IsometricPath();

        path.draw(PATH_COMMANDS);

        isometric.addChildren(path);

        pathPattern = path.getPattern();

        assert(!pathPattern);

        let cloneTexture: Texture = {
            ...texture,
            planeView: PlaneView.TOP
        };

        path.texture = cloneTexture;

        pathPattern = path.getPattern();

        assertEquals(path.texture, cloneTexture);
        assertEquals(pathPattern.getAttribute('patternTransform'), 'translate(146.077 100) matrix(0.707107,-0.408248,0.707107,0.408248,0,0) scale(1.224745)');

        cloneTexture = {
            ...cloneTexture,
            shift: { right: 1 },
            scale: 0.5
        };

        path.texture = cloneTexture;
        const image = pathPattern.firstChild as SVGImageElement;

        assertEquals(path.texture, cloneTexture);
        assertEquals(image.style.imageRendering, '');
        assertEquals(pathPattern.getAttribute('patternTransform'), 'translate(250 160) matrix(0.707107,-0.408248,0.707107,0.408248,0,0) scale(0.612372)');

    });

    it('Check updateTexture method', () => {

        path = new IsometricPath();

        path.draw(PATH_COMMANDS);

        isometric.addChildren(path);

        path.updateTexture({
            ...texture,
            height: 2,
            width: 3
        });

        pathPattern = path.getPattern();

        let image = pathPattern.firstChild as SVGImageElement;

        assertEquals(pathPattern.getAttribute('height'), '240');
        assertEquals(pathPattern.getAttribute('width'), '360');
        assertEquals(image.getAttribute('height'), '240');
        assertEquals(image.getAttribute('width'), '360');

        isometric.removeChild(path);

        path = new IsometricPath({
            texture
        });

        path.draw(PATH_COMMANDS);

        isometric.addChildren(path);

        const cloneTexture = {
            ...texture,
            planeView: PlaneView.TOP,
            shift: { left: 1 },
            rotation: {
                axis: Axis.TOP,
                value: 30
            },
            pixelated: true
        };

        path.updateTexture(cloneTexture);

        pathPattern = path.getPattern();
        image = pathPattern.firstChild as SVGImageElement;

        assertEquals(path.texture, {
            ...cloneTexture,
            shift: { left: 1 }
        });

        assertEquals(image.getAttribute('href'), cloneTexture.url);
        assertEquals(image.style.imageRendering, 'pixelated');
        assertEquals(pathPattern.getAttribute('patternTransform'), 'translate(42.154 160) matrix(0.965926,-0.149429,0.258819,0.557677,0,0) scale(1.224745)');

        const newUrl = '/images/new_texture.png';

        path.updateTexture({
            url: newUrl
        });

        assertEquals(path.texture, {
            ...cloneTexture,
            url: newUrl,
            shift: { left: 1 }
        });
        assertEquals(image.getAttribute('href'), newUrl);

        path.updateTexture({
            url: texture.url,
            pixelated: false
        });

        assertEquals(path.texture, {
            ...cloneTexture,
            shift: { left: 1 },
            pixelated: false
        });
        assertEquals(image.style.imageRendering, '');

        isometric.removeChildren(path);

        path = new IsometricPath();

        path.draw(PATH_COMMANDS);

        isometric.addChildren(path);

        path.updateTexture({
            pixelated: true
        });

        pathPattern = path.getPattern();

        assert(!pathPattern);

        isometric.removeChild(path);

    });

});
import { Command } from '../../../@constants/index.ts';
import {
    CommandPoint,
    SVGPathAnimation,
    SVGAnimationObject
} from '../../../@types/index.ts';
import { IsometricGraphic } from '../../abstract/IsometricGraphic/index.ts';
import {
    addSVGProperties,
    parseDrawCommands,
    getSVGPath,
    getTextureCorner
} from '../../../@utils/svg.ts';
import { IsometricPathProps } from './types.ts';

export class IsometricPath extends IsometricGraphic {
    // Exclude the next constructor from the coverage reports
    // Check https://github.com/microsoft/TypeScript/issues/13029
    /* istanbul ignore next */
    public constructor(props: IsometricPathProps = {}) {
        super(props);
        this.commands = [];
        this._autoclose = 'autoclose' in this.props
            ? !!(this.props as IsometricPathProps).autoclose
            : true;
    }

    private commands: CommandPoint[];
    private _autoclose: boolean;

    private getPathFromCommands = (commands: string): string => getSVGPath(
        parseDrawCommands(commands),
        this.data.centerX,
        this.data.centerY,
        this.data.scale,
        this._autoclose
    );

    protected privateUpdateAnimations(): void {

        this.animations.forEach((animation: SVGAnimationObject): void => {

            if (animation.property === 'path') {

                if (animation.values) {
                    addSVGProperties(
                        animation.element!,
                        {
                            values: Array.isArray(animation.values)
                                ? animation.values.map((value: string | number): string => {
                                    return this.getPathFromCommands(`${value}`);
                                }).join(';')
                                : this.getPathFromCommands(`${animation.values}`)
                        }
                    );
                } else {
                    addSVGProperties(animation.element!, {
                        from: this.getPathFromCommands(`${animation.from}`),
                        to: this.getPathFromCommands(`${animation.to}`)
                    });
                }

            }

        });

    }

    public get autoclose(): boolean {
        return this._autoclose;
    }

    public set autoclose(value: boolean) {
        this._autoclose = value;
        this.update();
    }

    public update(): IsometricPath {
        if (this.path.parentNode) {
            const corner = getTextureCorner(
                this.commands,
                this.data.centerX,
                this.data.centerY,
                this.data.scale
            );
            addSVGProperties(this.path, {
                d: getSVGPath(
                    this.commands,
                    this.data.centerX,
                    this.data.centerY,
                    this.data.scale,
                    this._autoclose
                )
            });
            this.updatePatternTransform(corner);
            this.updateAnimations();
        }
        return this;
    }

    public clear(): IsometricPath {
        this.commands.splice(0);
        addSVGProperties(this.path, {
            d: ''
        });
        return this;
    }

    public moveTo(right: number, left: number, top: number): IsometricPath {
        this.commands.push({
            command: Command.move,
            point: { r: right, l: left, t: top }
        });
        this.update();
        return this;
    }

    public lineTo(right: number, left: number, top: number): IsometricPath {
        this.commands.push({
            command: Command.line,
            point: { r: right, l: left, t: top }
        });
        this.update();
        return this;
    }

    public curveTo(
        controlRight: number,
        controlLeft: number,
        controlTop: number,
        right: number,
        left: number,
        top: number
    ): IsometricPath {
        this.commands.push({
            command: Command.curve,
            control: { r: controlRight, l: controlLeft, t: controlTop },
            point: { r: right, l: left, t: top }
        });
        this.update();
        return this;
    }

    public mt(right: number, left: number, top: number): IsometricPath {
        return this.moveTo(right, left, top);
    }

    public lt(right: number, left: number, top: number): IsometricPath {
        return this.lineTo(right, left, top);
    }
    public ct(
        controlRight: number,
        controlLeft: number,
        controlTop: number,
        right: number,
        left: number,
        top: number
    ): IsometricPath {
        return this.curveTo(controlRight, controlLeft, controlTop, right, left, top);
    }

    public draw(commands: string): IsometricPath {
        this.commands = parseDrawCommands(commands);
        this.update();
        return this;
    }

    public addAnimation(animation: SVGPathAnimation): IsometricPath {
        return super.addAnimation(animation) as IsometricPath;
    }

    public removeAnimationByIndex(index: number): IsometricPath {
        return super.removeAnimationByIndex(index) as IsometricPath;
    }

    public removeAnimations(): IsometricPath {
        return super.removeAnimations() as IsometricPath;
    }

}
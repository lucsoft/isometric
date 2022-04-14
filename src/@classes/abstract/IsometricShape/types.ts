import { IsometricPlaneView } from '../../../@types/index.ts';
import { IsometricGraphicProps } from '../IsometricGraphic/index.ts';

export interface IsometricShapeProps extends IsometricGraphicProps {
    planeView: IsometricPlaneView;
}
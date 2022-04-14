import { IsometricCanvas, IsometricRectangle, IsometricCanvasProps, PlaneView } from "https://raw.githubusercontent.com/lucsoft/isometric/master/src/index.ts";

const canvas = document.createElement("div");
document.body.append(canvas);

const cube = new IsometricCanvas(<IsometricCanvasProps>{
    container: canvas,
    scale: 120,
    width: 500,
    height: 320
})

const commonProps = { height: 1, width: 1 };
const topPiece = new IsometricRectangle({ ...commonProps, planeView: PlaneView.TOP });
const rightPiece = new IsometricRectangle({ ...commonProps, planeView: PlaneView.FRONT });
const leftPiece = new IsometricRectangle({ ...commonProps, planeView: PlaneView.SIDE });

topPiece.top = 1;

rightPiece.right = 1;

leftPiece.left = 1;

cube
    .addChild(topPiece)
    .addChild(rightPiece)
    .addChild(leftPiece);
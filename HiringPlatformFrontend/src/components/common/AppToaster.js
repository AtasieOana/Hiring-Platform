import {
    Position,
    Toaster,
} from "@blueprintjs/core";

export const AppToaster = Toaster.create({
    position: Position.BOTTOM_RIGHT,
});

export const AppToasterTop = Toaster.create({
    position: Position.TOP,
});
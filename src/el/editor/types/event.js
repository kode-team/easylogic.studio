import { AFTER } from "el/sapa/Event";

/** Custom Global Event Functions */ 

export const ADD_BODY_FIRST_MOUSEMOVE = 'add/body/first/mousemove'
export const ADD_BODY_MOUSEMOVE = 'add/body/mousemove'
export const ADD_BODY_MOUSEUP = 'add/body/mouseup'

export const FIRSTMOVE = (method = "move") => {
    return AFTER(`bodyMouseFirstMove ${method}`);
};

export const MOVE = (method = "move") => {
    return AFTER(`bodyMouseMove ${method}`);
};

export const END = (method = "end") => {
    return AFTER(`bodyMouseUp ${method}`);
};
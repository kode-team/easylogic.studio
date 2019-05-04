export const GETTER_PREFIX = '*/';
export const ACTION_PREFIX = '/';

export function GETTER (str) {
    return GETTER_PREFIX + str ;
}

export function ACTION (str) {
    return ACTION_PREFIX + str ;
}
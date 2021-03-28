let osInfo = {
    name: undefined
};

export function os() {
    if (osInfo.name === undefined) {
        if (navigator.appVersion.indexOf("Win") != -1) osInfo.name = 'win';
        else if (navigator.appVersion.indexOf("Mac") != -1) osInfo.name = 'mac'; 
        else if (navigator.appVersion.indexOf("X11") != -1) osInfo.name = 'linux';
        else osInfo.name = ""; 
    }

    return osInfo.name;
}
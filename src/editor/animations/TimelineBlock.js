export function createTimelineBlock (obj = {}) {
    return {
        timing: 'linear', 
        ...obj
    }
}
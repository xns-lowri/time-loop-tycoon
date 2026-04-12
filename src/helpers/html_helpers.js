export function newElement(type, params) {
    const element = document.createElement(type);
    for(const key in params) {
        element.setAttribute(key, params[key]);
    }
    return element;
}
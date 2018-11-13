/**
 * get single
 * @param fn function demo
 */
const getSingle = (fn: Function) => {
    let result: any;
    return function() {
        return result || (result = fn.apply(this, arguments));
    };
};

/**
 * print the name
 * @param name name
 */
const getName = (name: string) => {
    return name;
};
export { getSingle, getName };

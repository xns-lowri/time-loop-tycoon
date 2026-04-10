const units = [
    {
        value: 86400,
        long: "day",
        short: "d"
    },
    {
        value: 3600,
        long: "hour",
        short: "h"
    },
    {
        value: 60,
        long: "minute",
        short: "m"
    },
    {
        value: 1,
        long: "second",
        short: "s"
    },
    {
        value: 0.001,
        long: "millisecond",
        short: "ms"
    }
]

export function formatDecimalAsTime(value, options = { label:'short', trim: 2 }) {
    let result = [];

    units.forEach((unit) => {
        if(unit.value < 1) {
            //milliseconds
            value = value - Math.floor(value);
        }
        const amount = Math.floor(value / unit.value);
        if(amount > 0 || result.length > 0) {
            result.push(`${amount}${unit[options.label]}`)
        }
    });

    if(options.trim) {
        result = result.slice(0, options.trim);
    }

    return result.length ? result.join(" ") : "0s";
}
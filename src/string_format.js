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

export function formatDecimalAsTime(value, options = { label:'short' }) {
    let result = [];
    //console.log("spare time =", value, value.toFixed(3), value.toFixed(0));
    value = value.toFixed(3);

    units.forEach((unit) => {
        let amount = Math.floor(value / unit.value);
        if(unit.value < 1) {
            //milliseconds
            amount = value - Math.floor(value);
            amount = amount.toFixed(3);
            amount *= 1000;
        }
        if(amount > 0 || result.length > 0) {
            result.push(`${amount}${unit[options.label]}`)
        }
        value %= unit.value;
    });

    if(options.trim) {
        result = result.slice(0, options.trim);
    }

    return result.length ? result.join(" ") : "0s";
}

export function capitalFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
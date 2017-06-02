
const hasKeys = function (obj, props) {
    const keys = [];
    props.forEach((prop) => {
        if (!obj.hasOwnProperty(prop)) {
            keys.push(prop);
        }
    }, this);

    return keys;
};

module.exports = hasKeys;

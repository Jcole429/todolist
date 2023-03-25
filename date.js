exports.getCurrentDay = function () {
    const today = new Date();

    const dateOptions = {
        weekday: "long",
    };

    return today.toLocaleDateString("en-US", dateOptions);
}

exports.getCurrentDate = function () {
    const today = new Date();

    const dateOptions = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    return today.toLocaleDateString("en-US", dateOptions);
}
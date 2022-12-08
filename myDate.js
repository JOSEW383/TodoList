exports.getDate = function(){ // Option 1 to export function
    const today = new Date()
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    // const formatDate = today.toDateString();
    const formatDate = today.toLocaleDateString("en-US", options)

    return formatDate;
    // return getDay();
};

module.exports.getDay = getDay; // Option 2 to export function
function getDay(){
    weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const date = new Date()
    const day = date.getDay();
    return weekDays[day];
};
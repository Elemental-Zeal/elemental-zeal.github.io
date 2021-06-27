function getCurrentYear()
{
    var date = new Date();
    var year = date.getFullYear();

    return year;
}

function updateCurrentYear()
{
    var year = getCurrentYear();
    document.getElementById("currentYear").innerHTML = year
}
function getParameterByName(name, url = window.location.href)
{
    // name = name.replace(/[\[\]]/g, '\\$&');
    // var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
    var regex = new RegExp('[?&]' + name + '(=([^&#]*))'), results = regex.exec(url);

    if (!results)
    {
        return null;
    }
    if (!results[2])
    {
        return '';
    }

    // return decodeURIComponent(results[2].replace(/\+/g, ' '));
    return decodeURIComponent(results[2]);
}

function testAccessParameter()
{
    var test = getParameterByName('test');
    alert (test);
}

function testJSONReader()
{
    var request = new XMLHttpRequest();
    request.open("GET", "data/test.json", false);
    request.setRequestHeader('Content-Type', 'application/json;charset=utf-8;');
    request.send(null);

    var jsonObject = JSON.parse(request.responseText);
    alert(jsonObject.glossary.title);
}

function includeFile(filename, elementID)
{
    var request = new XMLHttpRequest();
    request.open("GET", "includes/" + filename, false);
    request.send(null);

    var content = request.responseText;

    document.getElementById(elementID).innerHTML = content
}
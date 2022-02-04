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

function readProjectsJson()
{
    var request = new XMLHttpRequest();
    request.open("GET", "data/projects.json", false);
    request.setRequestHeader('Content-Type', 'application/json;charset=utf-8;');
    request.send(null);

    var projectsObject = JSON.parse(request.responseText);
    return projectsObject;
}

function readProjectInformation(list, name)
{
    var request = new XMLHttpRequest();

    var jsonFile = "data/" + list + "/" + name +".json";
    console.log("Reading from: " + jsonFile);

    request.open("GET", jsonFile, false);
    request.setRequestHeader('Content-Type', 'application/json;charset=utf-8;');
    request.send(null);

    var projectObject = JSON.parse(request.responseText);
    return projectObject;
}

function includeList(projectsObject, list, elementID)
{
    var content = "";

    var projectList = projectsObject[list];

    const numProjects = projectList.length;

    var floatDirection = "Left"

    for (var i = numProjects - 1; i >= 0; i--)
    {
        if (i % 2 == 0)
        {
            floatDirection = "Left";
        }
        else
        {
            floatDirection = "Right";
        }

        var project = projectList[i];
        var name = project.name;

        var sanitizedName = project.sanitizedName;
        var projectInformation = readProjectInformation(list, sanitizedName);

        var releaseDate = "N/A"
        if (projectInformation.releaseDate)
        {
            releaseDate = projectInformation.releaseDate
        }

        var description = "N/A"
        if (projectInformation.description)
        {
            description = projectInformation.description
        }

        var thumbnail = "/art/thumbnail/" + sanitizedName + ".png"

        content += `<div id = "${sanitizedName}" class = "Sec">
                        <div class = "GamesCell ${floatDirection}"
                            <a href = "/project.html?project=${sanitizedName}">
                                <img src = "${thumbnail}"/>
                            </a>
                            <div class = "clear"></div>
                        </div>
                        <div class = "GameInfo">
						    <div class = "Stack${floatDirection}">
						        <div class = "Title">
                                    ${name}
                                </div>
                                <div class = "Date">
                                    ${releaseDate}
                                </div>
                                <div class = "Text">
                                    <p>
                                        ${description}
                                    </p>
                                </div>

                                <a href = "/project.html?project=${sanitizedName}" class = "action-button shadow animate Blue">
                                    Check It Out
                                </a>
                                <div class = "clear"></div>
                            </div>
                        </div>
                    </div>`;
    }

    document.getElementById(elementID).innerHTML = content
}

function includeFile(filename, elementID)
{
    var request = new XMLHttpRequest();
    request.open("GET", "includes/" + filename, false);
    request.send(null);

    var content = request.responseText;

    document.getElementById(elementID).innerHTML = content
}

function loadProjectPage()
{
    var projectName = getParameterByName('project');

    var projectLists = readProjectsJson();

    const numLists = projectLists.length;

    var projectInformation;
    var found = false;

    Object.keys(projectLists).forEach(key => {
        var projectList = projectLists[key];
        const numProjects = projectList.length;

        for (var i = 0; i < numProjects; i++)
        {
            if (found == true)
            {
                break;
            }

            var project = projectList[i];
            var sanitizedName = project.sanitizedName;

            if (sanitizedName === projectName)
            {
                projectInformation = readProjectInformation(key, sanitizedName);
                found = true;
                break;
            }
            else
            {
                console.log (sanitizedName + " did not equal " + projectName);
            }
        }
    });

    if (found == false)
    {
        window.location.href = "/404.html";
    }
    else
    {
        var title = projectInformation.title;
        updatePageTitle(title);
        updateProjectTitles(title);
        updateProjectReleaseDate(projectInformation.releaseDate);
        updateProjectDescription(projectInformation.description);
        updateProjectControls(projectInformation.controls, "projectControls", "Controls");
        updateProjectControls(projectInformation.mouseKeyboardControls, "mouseKeyboardControls", "Mouse/Keyboard Controls");
        updateProjectControls(projectInformation.controllerControls, "controllerControls", "Controller Controls");
        updateProjectScreenshots(projectName);
    }
}

function updatePageTitle(name)
{
    document.title = name + " - Elemental Zeal";
}

function updateProjectTitles(name)
{
    var elementID = "projectTitleDiv";
    document.getElementById(elementID).innerHTML = name;

    var elementID = "projectPageTitleDiv";
    document.getElementById(elementID).innerHTML = name;
}

function updateProjectReleaseDate(date)
{
    var elementID = "projectReleaseDateDiv";

    if (date)
    {
        document.getElementById(elementID).innerHTML = date;
    }
    else
    {
        var element = document.getElementById(elementID);
        element.parentNode.removeChild(element);
    }
}

function updateProjectDescription(description)
{
    var elementID = "projectDescription";

    if (description)
    {
        var contents = "<b>Description</b><br><br>";
        contents += description;

        document.getElementById(elementID).innerHTML = contents;
    }
    else
    {
        var element = document.getElementById(elementID);
        element.parentNode.removeChild(element);
    }
}

function updateProjectControls(controls, elementID, label)
{
    if (controls)
    {    
        var contents = "<b>" + label + "</b><ui><br><br>";

        for (index in controls)
        {
            control = controls[index];
            contents += "<li> " + control + "</li>";
        }

        contents += "</ui>";
        document.getElementById(elementID).innerHTML = contents;
    }
    else
    {
        var element = document.getElementById(elementID);
        element.parentNode.removeChild(element);
    }
}

function updateProjectScreenshots(name)
{
    var elementID = "mainScreenshot";
    var imageElement = '<img class="bigScreenshot" src="/art/screenshots/' + name + '/SS01.png"></img>'
    document.getElementById(elementID).innerHTML = imageElement;
}
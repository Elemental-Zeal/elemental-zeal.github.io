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
        var descriptionFile = getDescription(sanitizedName);
        if (descriptionFile)
        {
            description = descriptionFile;
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

function getDescription(name)
{
    try
    {
        var request = new XMLHttpRequest();
        request.open("GET", "data/descriptions/" + name + ".html", false);
        request.send(null);

        var content = request.responseText;

        return content;
    }
    catch
    {
        return null;
    }
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

    // const numLists = projectLists.length;

    var projectInformation;
    var found = false;

    var sanitizedName;

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
            sanitizedName = project.sanitizedName;

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
        var description = getDescription(sanitizedName);
        updatePageTitle(title);
        updateProjectTitles(title);
        updateProjectReleaseDate(projectInformation.releaseDate);
        updateProjectDescription(description);
        updateProjectControls(projectInformation.controls, "projectControls", "Controls");
        updateProjectControls(projectInformation.mouseKeyboardControls, "mouseKeyboardControls", "Mouse/Keyboard Controls");
        updateProjectControls(projectInformation.controllerControls, "controllerControls", "Controller Controls");
        updateProjectScreenshots(projectName);
        updateProjectButtons(projectInformation.ludumDare, projectInformation.itchio, projectInformation.playstore);
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
    var imageElement = '<img class="bigScreenshot" src="/art/screenshots/' + name + '/SS01.png"></img>';
    document.getElementById(elementID).innerHTML = imageElement;
}

function updateProjectButtons(ludumDareLink, itchioLink, playstoreLink)
{
    var elementID = "buttonBar";

    var contents = "";

    if (ludumDareLink)
    {
        contents = '<a href="' + ludumDareLink + '" class="action-button shadow animate Purple PlayPage">';
        contents += 'Ludum Dare';
        contents += '</a>';
    }

    if (itchioLink)
    {
        contents += '<a href="' + itchioLink + '" class="action-button shadow animate Pink PlayPage">';
        contents += 'Itch.io';
        contents += '</a>';
    }

    if (playstoreLink)
    {
        contents += '<a href="' + playstoreLink + '" class="action-button shadow animate Blue PlayPage">';
        contents += 'Google Play';
        contents += '</a>';
    }

    document.getElementById(elementID).innerHTML = contents;
}

function loadHomePage()
{
    var projectsObject = readProjectsJson();
    updateRecentGames(projectsObject);
    updateRecentJams(projectsObject);
    updateRecentPrototypes(projectsObject);
}

function updateRecentGames(projectsObject)
{
    var list = "games";
    var projectList = projectsObject[list];

    var elementID = "recentGames";

    var contents = "";
    var count = 3;

    for (var i = 0; i < count; i++)
    {
        var project = projectList[i];
        var name = project.name;

        var sanitizedName = project.sanitizedName;

        var description = "N/A"
        var descriptionFile = getDescription(sanitizedName);
        if (descriptionFile)
        {
            description = descriptionFile;
        }

        var thumbnail = "/art/thumbnail/" + sanitizedName + ".png"

        contents += `<a href="project.html?project=${sanitizedName}">
                        <div class='imageOverlay'>
                            <img src="${thumbnail}"/>
                            <div class='imageText'>
                                    <div class='imageTitle'>
                                        ${name}
                                    </div>
                                    <div class='imageDescription'>
                                        ${description}
                                    </div>
                                    <div class='imageLink'>
                                        Check It Out
                                    </div>
                            </div>
                        </div>
                    </a>`;
    }

    document.getElementById(elementID).innerHTML = contents;
}

function updateRecentJams(projectsObject)
{
    var list = "jams";
    var projectList = projectsObject[list];
    var listCount = projectList.length;

    var elementID = "recentJams";

    var contents = "";
    var count = 3;

    for (var i = 1; i <= count; i++)
    {
        var project = projectList[listCount - i];
        var name = project.name;

        var sanitizedName = project.sanitizedName;

        var description = "N/A"
        var descriptionFile = getDescription(sanitizedName);
        if (descriptionFile)
        {
            description = descriptionFile;
        }

        var thumbnail = "/art/thumbnail/" + sanitizedName + ".png"

        contents += `<a href="project.html?project=${sanitizedName}">
                        <div class='imageOverlay'>
                            <img src="${thumbnail}"/>
                            <div class='imageText'>
                                    <div class='imageTitle'>
                                        ${name}
                                    </div>
                                    <div class='imageDescription'>
                                        ${description}
                                    </div>
                                    <div class='imageLink'>
                                        Check It Out
                                    </div>
                            </div>
                        </div>
                    </a>`;		
    }

    document.getElementById(elementID).innerHTML = contents;
}

function updateRecentPrototypes(projectsObject)
{
    var list = "prototypes";
    var projectList = projectsObject[list];

    var elementID = "recentPrototypes";

    var contents = "";
    var count = 3;

    for (var i = 0; i < count; i++)
    {
        var project = projectList[i];
        var name = project.name;

        var sanitizedName = project.sanitizedName;

        var description = "N/A"
        var descriptionFile = getDescription(sanitizedName);
        if (descriptionFile)
        {
            description = descriptionFile;
        }

        var thumbnail = "/art/thumbnail/" + sanitizedName + ".png"

        contents += `<a href="project.html?project=${sanitizedName}">
                        <div class='imageOverlay'>
                            <img src="${thumbnail}"/>
                            <div class='imageText'>
                                    <div class='imageTitle'>
                                        ${name}
                                    </div>
                                    <div class='imageDescription'>
                                        ${description}
                                    </div>
                                    <div class='imageLink'>
                                        Check It Out
                                    </div>
                            </div>
                        </div>
                    </a>`;	
    }

    document.getElementById(elementID).innerHTML = contents;
}
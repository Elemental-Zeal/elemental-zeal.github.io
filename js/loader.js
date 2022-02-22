function getParameterByName(name, url = window.location.href)
{
    const regex = new RegExp('[?&]' + name + '(=([^&#]*))'), results = regex.exec(url);

    if (!results)
    {
        return null;
    }
    if (!results[2])
    {
        return '';
    }

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

function readProjectInformation(name)
{
    const jsonFile = "data/projects/" + name +".json";

    var request = new XMLHttpRequest();

    request.open("GET", jsonFile, false);
    request.setRequestHeader('Content-Type', 'application/json;charset=utf-8;');
    request.send(null);

    var projectObject = JSON.parse(request.responseText);
    return projectObject;
}

function includeList(projectsObject, list, elementID)
{
    var projectList = projectsObject[list];
    const numProjects = projectList.length;

    var floatDirection = "Left"
    var content = "";

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

        const project = projectList[i];
        const name = project.name;

        const sanitizedName = project.sanitizedName;
        const projectInformation = readProjectInformation(sanitizedName);

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

        const thumbnail = "/art/thumbnail/" + sanitizedName + ".png"

        content += `<div id = "${sanitizedName}" class = "Sec">
                        <div class = "GamesCell ${floatDirection}"
                            <a href = "/project.html?project=${sanitizedName}">
                                <img src = "${thumbnail}" alt = "${sanitizedName}" width=315 height=250/>
                            </a>
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
    const projectName = getParameterByName('project');
    var projectLists = readProjectsJson();
    
    var found = false;

    var projectInformation;
    var sanitizedName;

    Object.keys(projectLists).forEach(key => {
        const projectList = projectLists[key];
        const numProjects = projectList.length;

        for (var i = 0; i < numProjects; i++)
        {
            if (found == true)
            {
                break;
            }

            const project = projectList[i];
            sanitizedName = project.sanitizedName;

            if (sanitizedName === projectName)
            {
                projectInformation = readProjectInformation(sanitizedName);
                found = true;
                break;
            }
        }
    });

    if (found == false)
    {
        window.location.href = "/404.html";
    }
    else
    {
        updatePageTitle(projectInformation.title);
        updateProjectTitles(projectInformation.title);
        updateProjectReleaseDate(projectInformation.releaseDate);
        updateProjectDescription(sanitizedName);
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

    elementID = "projectPageTitleDiv";
    document.getElementById(elementID).innerHTML = name;
}

function updateProjectReleaseDate(date)
{
    const elementID = "projectReleaseDateDiv";

    if (date)
    {
        document.getElementById(elementID).innerHTML = date;
    }
    else
    {
        const element = document.getElementById(elementID);
        element.parentNode.removeChild(element);
    }
}

function updateProjectDescription(sanitizedName)
{
    const elementID = "projectDescription";

    const description = getDescription(sanitizedName);
    if (description)
    {
        var contents = "<b>Description</b><br><br>";
        contents += description;

        document.getElementById(elementID).innerHTML = contents;
    }
    else
    {
        const element = document.getElementById(elementID);
        element.parentNode.removeChild(element);
    }
}

function updateProjectControls(controls, elementID, label)
{
    if (controls)
    {    
        var contents = "<b>" + label + "</b><ul>";

        for (index in controls)
        {
            control = controls[index];
            contents += "<li> " + control + "</li>";
        }

        contents += "</ul>";
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
    const elementID = "mainScreenshot";
    const imageElement = '<img class="bigScreenshot" src="/art/screenshots/' + name + '/SS01.png" alt="A screenshot for the project" width="1280" height="720">';
    document.getElementById(elementID).innerHTML = imageElement;
}

function updateProjectButtons(ludumDareLink, itchioLink, playstoreLink)
{
    const elementID = "buttonBar";

    var contents = "";

    if (ludumDareLink)
    {
        contents += '<a href="' + ludumDareLink + '" class="action-button shadow animate Purple PlayPage">';
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
    const projectLists = readProjectsJson();
    updateRecentGames(projectLists);
    updateRecentJams(projectLists);
    updateRecentPrototypes(projectLists);
}

function updateRecentGames(projectLists)
{
    const list = "games";
    const projectList = projectLists[list];
    const listCount = projectList.length;

    const elementID = "recentGames";

    var contents = "";
    const count = 3;

    for (var i = 1; i <= count; i++)
    {
        const project = projectList[listCount - i];
        contents += getRecentProject(project);
    }

    document.getElementById(elementID).innerHTML = contents;
}

function updateRecentJams(projectLists)
{
    const list = "jams";
    const projectList = projectLists[list];
    const listCount = projectList.length;

    const elementID = "recentJams";

    var contents = "";
    const count = 3;

    for (var i = 1; i <= count; i++)
    {
        const project = projectList[listCount - i];
        contents += getRecentProject(project);
    }

    document.getElementById(elementID).innerHTML = contents;
}

function updateRecentPrototypes(projectLists)
{
    const list = "prototypes";
    const projectList = projectLists[list];
    const listCount = projectList.length;

    const elementID = "recentPrototypes";

    var contents = "";
    const count = 3;

    for (var i = 1; i <= count; i++)
    {
        const project = projectList[listCount - i];
        contents += getRecentProject(project);
    }

    document.getElementById(elementID).innerHTML = contents;
}

function getRecentProject(project)
{
    const name = project.name;

    const sanitizedName = project.sanitizedName;

    var description = "N/A"
    const descriptionFile = getDescription(sanitizedName);
    if (descriptionFile)
    {
        description = descriptionFile;
        description = truncateDescription(description);
    }

    const thumbnail = "/art/thumbnail/" + sanitizedName + ".png"

    content = `<a href="project.html?project=${sanitizedName}">
                        <div class='imageOverlay'>
                            <img src="${thumbnail}" alt="${sanitizedName}"/>
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
    return content;
}

function truncateDescription(description)
{
    const maxLength = 25; // number of words
    const originalLength = description.length;

    var truncatedDescription = description.split(' ').slice(0, maxLength).join(' ');
    truncatedDescription += " . . . "
    const newLength = truncatedDescription.length;

    // Only truncate if the new length is shorter than the original length
    if (newLength < originalLength)
    {
        return truncatedDescription;
    }
    else
    {
        return description;
    }
}
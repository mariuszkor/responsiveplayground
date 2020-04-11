//*GLOBAL VARIABLES
let currentDevice = "desktop";

const devicesWidth = {
    'phone-portrait': 360+10,//Bootsrtap beakpoint+2*border-width
    'phone-landscape': 576+10,
    'tablet': 768+10,
    'laptop': 992+10,
    'desktop': 1200+10,
}

const devicesIcons = {
    'phone-portrait': '<i class="fas fa-mobile-alt"></i>',
    'phone-landscape': '<i class="fas fa-mobile-alt" style="transform: rotate(90deg)"></i>',
    'tablet': '<i class="fas fa-tablet-alt"></i>',
    'laptop': '<i class="fas fa-laptop"></i>',
    'desktop': '<i class="fas fa-desktop"></i>',
}

const minViewportWidth = 1460;
const minViewportHeight = 730;

let currentEmbeddedType = '';
let currentEmbeddedId = -1;


let currentResolutions = {
    playgroundCurrentWidth: document.getElementById('playground').offsetWidth,
    playgroundCurrentHeight: document.getElementById('playground').offsetHeight,
};


//*Render main menu 
function renderMenu() {
    let itemTypes = Object.keys(mainMenuContent);

    for (let itemType in itemTypes) {

        let currentItemType = itemTypes[itemType];

        document.getElementById('main-menu-area').innerHTML +=
            '<button href="#main-menu-box-' + currentItemType + '" class="w-100 text-uppercase"  data-toggle="collapse" aria-expanded="false" aria-controls="main-menu-box-' + currentItemType + '"><strong>' + currentItemType + '</strong></button>';
        document.getElementById('main-menu-area').innerHTML += '<div id="main-menu-box-' + currentItemType + '" class="collapse">';


        for (let itemName in mainMenuContent[currentItemType]) {

            let currentItemName = mainMenuContent[currentItemType][itemName];

            document.getElementById('main-menu-box-' + currentItemType).innerHTML +=
                '<button class="w-100 button-element" onmouseover="showPreview(\'' + currentItemType + '\' , \'' + currentItemName + '\')" onmouseout="hidePreview()" onclick="chooseEmbedFile(\'' + currentItemType + '\' , \'' + currentItemName + '\')">' +
                currentItemName + '</button>';
        }
        document.getElementById('main-menu-area').innerHTML += '</div>';

    }
    return 0;
}

//*Preview handle
function showPreview(type, name) {

    let screenshotPath = 'content/' + type + '/' + name + '/' + name + '.png';

    if (fileExists(screenshotPath)) {
        document.getElementById('preview-img').src = screenshotPath;
    } else {
        document.getElementById('preview-img').src = 'img/fallback.png';
    }

    document.getElementById('preview-area').style.cssText = "width: 40vh; height: 40vh; border-width: 5px;"

}

function hidePreview() {
    document.getElementById('preview-area').style.cssText = "width: 0; height=0;"
}

function fileExists(file_url) {

    var http = new XMLHttpRequest();

    http.open('HEAD', file_url, false);
    http.send();

    return http.status != 404;

}


//*Embed file in playground

function chooseEmbedFile(fileType, fileName) {

    currentEmbeddedType = fileType;
    currentEmbeddedId = mainMenuContent[fileType].indexOf(fileName);

    playgroundResize('desktop');

    document.getElementById("button-prev").disabled = false;
    document.getElementById("button-next").disabled = false;

    return 0;
}


function emdbedFile() {

    let name = mainMenuContent[currentEmbeddedType][currentEmbeddedId];
    let filePath = 'content/' + currentEmbeddedType + '/' + name + '/' + name + '.html';
    let fileNotesPath = 'content/' + currentEmbeddedType + '/' + name + '/' + name + '-notes.html'

    document.getElementById('embedded-name').innerHTML = '<strong>' + name + '</strong>';

    if (fileExists(filePath)) {
        document.getElementById('playground').innerHTML = '<embed id="current-embedded-element" src="' + filePath + '">';
    } else {
        document.getElementById('playground').innerHTML =
            '<p class="h1 text-center">OOPS... There is no such file.</p>' +
            '<p class="h3 text-center">Plesae, choose another item.</p>';
    }

    if (fileExists(fileNotesPath)) {
        document.getElementById('embedded-notes').innerHTML = '<embed src="' + fileNotesPath + '">';
    } else {
        document.getElementById('embedded-notes').innerHTML =
            '<p>There are no notes for this file.</p>';
    }


    document.getElementById('current-embedded-element').style.width = '100%';


    return 0;
}


function embedNextPrev(direction) {

    let filesNumber = mainMenuContent[currentEmbeddedType].length - 1;

    if (direction == 'next') {
        if (currentEmbeddedId == filesNumber) {
            currentEmbeddedId = 0;
        } else {
            currentEmbeddedId++;
        }

    } else if (direction == 'prev') {
        if (currentEmbeddedId == 0) {
            currentEmbeddedId = filesNumber;
        } else {
            currentEmbeddedId--;
        }

    }

    playgroundResize('desktop');

    return 0;
}


//*Resize dispaly area
function playgroundResize(device) {
    currentDevice=device;

    document.getElementById('playground').style.cssText = 'width: ' + devicesWidth[device] + 'px; transition: .5s';
    document.getElementById('playground').innerHTML = '';
    setTimeout(function () { emdbedFile(); }, 501); //refresh embedded file
    setTimeout(function () { checkResolutions(); }, 501);

    return 0;
}


//*Observe resolutions
window.onresize = function () { checkViewportResolutionForAlert(); checkResolutions(); }

function checkResolutions() {
    currentResolutions = {
        playgroundCurrentWidth: document.getElementById('playground').offsetWidth,
        playgroundCurrentHeight: document.getElementById('playground').offsetHeight,
    };
    displayResolutions();
}


function displayResolutions() {
    //currentDevice = findKeyOfValue(devicesWidth, currentResolutions['playgroundCurrentWidth']);

    document.getElementById('playground-resolution').innerHTML =
        (currentResolutions['playgroundCurrentWidth']-10) + "x" + (currentResolutions['playgroundCurrentHeight']-10);
    document.getElementById('playground-devices-area').innerHTML =
        devicesIcons[currentDevice];
    document.getElementById('viewport-resolution').innerHTML =
        window.innerWidth + "x" + window.innerHeight;
}


function checkViewportResolutionForAlert() {

    if ((window.innerWidth < minViewportWidth) || (window.innerHeight < minViewportHeight)) {

        document.getElementById('resolution-alert-min-width-area').innerHTML = minViewportWidth;
        document.getElementById('resolution-alert-min-height-area').innerHTML = minViewportHeight;
        document.getElementById('resolution-alert-current-width-area').innerHTML = window.innerWidth;
        document.getElementById('resolution-alert-current-height-area').innerHTML = window.innerHeight;

        if (window.innerWidth < minViewportWidth) {
            document.getElementById('resolution-alert-current-width-area').classList.add('text-warning');
        } else {
            document.getElementById('resolution-alert-current-width-area').classList.remove('text-warning');
        }

        if (window.innerHeight < minViewportHeight) {
            document.getElementById('resolution-alert-current-height-area').classList.add('text-warning');
        } else {
            document.getElementById('resolution-alert-current-height-area').classList.remove('text-warning');
        }

        alertHandle('resolution-alert', true);

    } else {

        alertHandle('resolution-alert', false);

    };
}

//*Resolution alert handle
function alertHandle(typeOfAlert, state) {
    if (state) {
        document.getElementById(typeOfAlert).style.cssText = 'width:100vw; height:100vh; overflow:auto;';

    } else {
        document.getElementById(typeOfAlert).style.cssText = 'width:0; height:0';
    }
}

//*Find key of value

//>simple version BLOCKED WHOLE CODE IN IE
// function findKeyOfValue(obj, val){
//     return Object.keys(obj).find(key => obj[key] === val);
// }

//>crossbrowsers version
function findKeyOfValue(obj, val) {
    let keys = Object.keys(obj);
    //let values = Object.values(obj); - not working in IE;
    let values = Object.keys(obj).map(function (e) { return obj[e] });
    let currentKeyId = values.indexOf(val);

    return keys[currentKeyId];
}
// Check if browser is IE;
// function checkIE() {

//     var ua = window.navigator.userAgent;
//     var msie = ua.indexOf("MSIE ");

//     if (!(msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))) 
//     {
//         alertHandle('IE-alert', false)
//     }
//     else 
//     return false;
// }


//***Document start */
window.onload = renderMenu();
window.onload = checkResolutions();
window.onload = checkViewportResolutionForAlert();














const $ = (id: string): HTMLElement => {
    return document.getElementById(id)!;
};

let userContainer = $("users");
let infoElement = $("info");
let breakElement = $("break");
let userElements: NodeListOf<HTMLElement>;

let infoShown = false;

let loadCount = 0;

let resultCount = 12;

let users: any[] = [];

window.addEventListener("DOMContentLoaded", async () => {
    if (users.length >= resultCount) {
        return;
    }
    await fetch(`https://randomuser.me/api/?results=${resultCount}`)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < resultCount; i++) {
                users.push(data.results[i]);
            }
        });

    infoElement.innerHTML = `<div id="info">Loading images...<div class="loader"></div></div>`;
    users.sort((a, b) => a.name.first.charCodeAt(0) - b.name.first.charCodeAt(0));
    users.forEach((user, i) => {
        let imageElement = document.createElement("img");
        imageElement.src = user.picture.large;
        imageElement.addEventListener("load", imgLoad)
        let figureElement = document.createElement("figure");
        let figCaption = document.createElement("figcaption");
        figCaption.innerHTML = `${user.name.first} ${user.name.last}`;
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figCaption);
        figureElement.id = i.toString();
        userContainer.insertBefore(figureElement, breakElement);
    });
    userElements = document.querySelectorAll("figure");
    for (let element of userElements) {
        element.addEventListener("click", handleUserClick)
    }
});

const imgLoad = () => {
    loadCount++;
    if (loadCount === resultCount && !infoShown) {
        infoElement.style.textAlign = "left";
        infoElement.innerHTML = "Click user to see more info";
    }
}

const toggleUsers = () => {
    if (!infoShown) {
        return;
    }
    breakElement.style.display = "block";
    infoShown = false;
    infoElement.innerHTML = "Click user to see more info";
    for (let i = 0; i < userElements.length; i++) {
        userElements[i].style.display = "block";
    }
}


const handleUserClick = function (this: HTMLElement) {
    if (infoShown) {
        toggleUsers();
        return;
    }
    infoShown = true;
    let id = parseInt(this.id);
    let user = users[id];
    for (let i = 0; i < userElements.length; i++) {
        if (i !== id) {
            userElements[i].style.display = "none";
        }
    }
    let userDOB = new Date(Date.parse(user.dob.date));
    infoElement.innerHTML = `${user.location.street.number} ${user.location.street.name}, 
    ${user.location.city}, ${user.location.country}<br/>
    ${user.email}<br/>
    ${("0" + (userDOB.getMonth() + 1)).slice(-2)}-${("0" + userDOB.getDate()).slice(-2)}-${userDOB.getFullYear()}<br />
    <br />
    <span class="back">Go back</span>`
    breakElement.style.display = "none";
    let backElements = document.querySelectorAll(".back");
    for (let element of backElements) {
        element.addEventListener("click", handleUserClick)
    }
};
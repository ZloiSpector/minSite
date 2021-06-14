"use strict";

//work database

const baseUrl = "https://60c5df0aec8ef800175e18e7.mockapi.io/minSite/links",
  headers = { "Content-Type": "application/json;charset=utf-8" };

let linksArray = [];

function disabled () {
    document.querySelectorAll('.dis').forEach((item) => {
        item.setAttribute("disabled", "disabled");
    });
    document.querySelector('#shadow').classList.add('shadow');
}

function enabled () {
    document.querySelectorAll('.dis').forEach((item) => {
        item.removeAttribute("disabled");
    });
    document.querySelector('#shadow').classList.remove('shadow');
}

async function createSite2 (siteData) {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(siteData),
      });
    if (response.ok) {
        getSiteList();
    }
}

const createSite = (siteData) =>
  fetch(baseUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(siteData),
  });

async function updateSite2 (siteId, siteData) {
    const response = await fetch(`${baseUrl}/${siteId}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(siteData),
      });
    if (response.ok) {
        getSiteList();
    }
}

const updateSite = (siteId, siteData) => {
  fetch(`${baseUrl}/${siteId}`, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(siteData),
  });
    getSiteList();
};

async function deleteSite2 (siteId) {
    const response = await fetch(`${baseUrl}/${siteId}`, {
        method: "DELETE",
      });
    if (response.ok) {
        getSiteList();
    }
}
const deleteSite = (siteId) => {
  fetch(`${baseUrl}/${siteId}`, {
    method: "DELETE",
  });
    getSiteList();
};

async function getSiteList() {
  const response = await fetch(baseUrl);
  const data = await response.json();
  if (response.ok) {
      enabled();
    linksArray = data;
    document.querySelectorAll(".link").forEach((item) => {
      item.remove();
    });
    if (linksArray.length > 0) {
      for (let i = 0; i < linksArray.length; i++) {
        newLink(
          linksArray[i].maxSite,
          linksArray[i].minSite,
          linksArray[i].id,
          linksArray[i].counter
        );
      }
    }
    clickBtnBase();
  }
}
getSiteList();

function clickBtnBase() {
  document.querySelectorAll(".removeLink").forEach((item, index) => {
    item.addEventListener("click", () => {
      let id = document.querySelectorAll(".link")[index].getAttribute("name");
      disabled()
      deleteSite2(id);
    });
  });
  document.querySelectorAll(".linkMinSite").forEach((item, index) => {
    item.addEventListener("click", () => {
      let newSite = {
        maxSite: item.getAttribute("href"),
        minSite: item.innerHTML,
        counter:
          Number(document.querySelectorAll(".counter")[index].innerHTML) + 1,
      };
      let id = document.querySelectorAll(".link")[index].getAttribute("name");
      disabled()
      updateSite2(id, newSite);
    });
  });
}

//work site

const inputMaxSite = document.querySelector("#maxSite"),
  inputMinSite = document.querySelector("#minSite"),
  btnClear = document.querySelector(".btnClear"),
  btnAdd = document.querySelector(".btnAdd"),
  counter = document.querySelectorAll(".counter");

inputMaxSite.addEventListener("input", () => {
  inputMinSite.value = getMinSite(inputMaxSite.value);
});

btnAdd.addEventListener("click", () => {
  let copy = testCopy();
  console.log(copy);
  if (inputMaxSite.value != "" && inputMinSite.value != ""
   && inputMinSite.value != "Неверная ссылка" && copy) {
    let newSite = {
      maxSite: inputMaxSite.value,
      minSite: `minSite.com/${inputMinSite.value}`,
      counter: 0,
    };
    disabled();
    createSite2(newSite);
  } else {
    alert("Данная короткая ссылка уже присутствует в списке или поля не заполнены!");
  }
});

function testCopy() {
  let array = [];
  for (let i = 0; i < linksArray.length; i++) {
    array.unshift(linksArray[i].minSite);
  }
  console.log(array);
  if (array.length == 0) {
    return true;
  } else {
    return !array.includes(`minSite.com/${inputMinSite.value}`);
  }
}

function newLink(maxSite, minSite, id, counter = 0) {
  if (minSite != "" && maxSite != "") {
    let newLink = document.createElement("section");
    newLink.className = "link";
    newLink.setAttribute("name", id);
    newLink.innerHTML = `<a href="${maxSite}" target="_blank"
        class="linkMinSite siteText dis">${minSite}</a>
        <p class="counter">${counter}</p>
        <button class="removeLink dis">Удалить</button>`;
    document
      .querySelector(".linksList")
      .insertAdjacentElement("beforeend", newLink);
  }
}

function getMinSite(site) {
  if (site != "") {
    try {
      let str = site.split("//")[1].split("/")[0];
      return str;
    } catch {
      return "Неверная ссылка";
    }
  } else {
    return "";
  }
}

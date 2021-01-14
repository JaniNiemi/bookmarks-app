const modal = document.querySelector("#modal");
const modalShow = document.querySelector("#show-modal");
const modalClose = document.querySelector("#close-modal");
const bookmarkForm = document.querySelector("#bookmark-form");
const websiteNameEl = document.querySelector("#website-name");
const websiteUrlEl = document.querySelector("#website-url");
const bookmarksContainer = document.querySelector("#bookmarks-container");

let bookmarks = [];

// show modal, focus on first input
function showModal() {
    modal.classList.add("show-modal");
    websiteNameEl.focus();
}

// validate form
function validateInput(nameValue, urlValue) {
    const expression = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert("Please submit values for both fields");
        return false;
    }
    if(!urlValue.match(regex)) {
        alert("Please provide a valid web address");
        return false;
    }
    // Valid
    return true;
}

// build bookmarks DOM
function buildBookmarks() {
    // remove all bookmark elements
    bookmarksContainer.textContent = "";
    // build items
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        // item div
        const item = document.createElement("div");
        item.classList.add("item");
        // close icon
        const closeIcon = document.createElement("i");
        closeIcon.classList.add("fas", "fa-times");
        closeIcon.setAttribute("title", "Delete bookmark");
        closeIcon.setAttribute("onclick", `deleteBookmark("${url}")`);
        // favicon / link container
        const linkInfo = document.createElement("div");
        linkInfo.classList.add("name");
        // favicon
        const favicon = document.createElement("img");
        favicon.setAttribute("src", `https://www.google.com/s2/u/0/favicons?domain=${url}`);
        favicon.setAttribute("alt", "favicon");
        // link
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("target", "_blank");
        link.textContent = name;
        // append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    })
}

// fetch bookmarks
function fetchBookmarks() {
    // get bookmarks from localStorage if available
    if(localStorage.getItem("bookmarks")) {
        bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    } else {
        // create bookmarks array in localStorage
        bookmarks = [
            {
                name: "JTNiemi Designs",
                url: "https://jtniemi.net"
            }
        ];
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// delete bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    // update bookmarks array in localStorage, rebuild DOM
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
}

// handle form input
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes("http://") && !urlValue.includes("https://")) {
        urlValue = `https://${urlValue}`;
    }
    if (!validateInput(nameValue, urlValue)) return false;
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// modal event listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () => modal.classList.remove("show-modal"));
window.addEventListener("click", (e) => e.target === modal ? modal.classList.remove("show-modal") : false );
window.addEventListener("keydown", (key) => key.key === "Escape" ? modal.classList.remove("show-modal") : false );

// event listeners
bookmarkForm.addEventListener("submit", storeBookmark);

// on page load
fetchBookmarks();
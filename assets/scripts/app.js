const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// show modal
function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

//delete bookmark
function deleteBookmark(url) {
  console.log("delete this bookmark" + url);
  bookmarks.forEach((bookmark,i) =>{
    if(bookmark.url === url) {
      bookmarks.splice(i,1)
    }
  });
  //update bookmarks
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();

}

//store bookmark
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;

  if (!validateForm(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };

  bookmarks.push(bookmark);

  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

function fetchBookmarks() {
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  }

  buildBookmarks();
}
//build bookmarks
function buildBookmarks() {
  //remove all container before building
  bookmarksContainer.textContent = '';
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    //item
    const item = document.createElement('div');
    item.classList.add('item');
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times-circle');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onClick', `deleteBookmark('${url}')`);
    //favicon //link
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    //favicon
    const favicon = document.createElement('img');
    favicon.setAttribute(
      'src',
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute('alt', 'Favicon');
    //link
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;
    //Append to bookmark container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

function validateForm(nameValue, urlValue) {
  const expression = /(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
  const regex = new RegExp(expression);
  if (urlValue.match(regex)) {
  }

  if (!nameValue || !urlValue) {
    alert('please submit both values');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert('please provide a valid url');
    return false;
  }

  return true;
}

modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () =>
  modal.classList.remove('show-modal')
);
window.addEventListener('click', (e) =>
  e.target === modal ? modal.classList.remove('show-modal') : false
);
bookmarkForm.addEventListener('submit', storeBookmark);

//on load
fetchBookmarks();

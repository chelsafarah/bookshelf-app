const books = [];
const RENDER_EVENT = "render-books";
const SEARCH_EVENT = "search-books";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "bookshelf_APPS";

function generateId() {
  return +new Date();
}

function generateBookObject(id, bookTitle, author, year, isCompleted) {
  return {
    id,
    bookTitle,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBookshelf(bookObject) {
  const { id, bookTitle, author, year, isCompleted } = bookObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = bookTitle;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis: " + author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun: " + year;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);
  container.setAttribute("id", `book-${id}`);

  if (!isCompleted) {
    const completedStatus = document.createElement("button");
    completedStatus.classList.add("green");
    completedStatus.innerText = "Selesai dibaca";
    completedStatus.addEventListener("click", function () {
      completeBook(id);
    });

    const deleteBook = document.createElement("button");
    deleteBook.classList.add("red");
    deleteBook.innerText = "Hapus buku";
    deleteBook.addEventListener("click", function () {
      let text = "Apakah anda yakin ingin menghapus buku?";
      if (confirm(text) == true) {
        removeBook(id);
      }
    });

    const actions = document.createElement("div");
    actions.classList.add("action");
    actions.append(completedStatus, deleteBook);

    container.append(actions);
  } else {
    const completedStatus = document.createElement("button");
    completedStatus.classList.add("green");
    completedStatus.innerText = "Belum selesai di Baca";
    completedStatus.addEventListener("click", function () {
      uncompleteBook(id);
    });

    const deleteBook = document.createElement("button");
    deleteBook.classList.add("red");
    deleteBook.innerText = "Hapus buku";
    deleteBook.addEventListener("click", function () {
      let text = "Apakah anda yakin ingin menghapus buku?";
      if (confirm(text) == true) {
        removeBook(id);
      }
    });

    const actions = document.createElement("div");
    actions.classList.add("action");
    actions.append(completedStatus, deleteBook);

    container.append(actions);
  }

  return container;
}

function addBook() {
  const textBookTitle = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, textBookTitle, author, year, isCompleted, false);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function searchBook() {
  const BookTitle = document.getElementById("searchBookTitle").value;
  document.dispatchEvent(new Event(SEARCH_EVENT));
}

function completeBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function uncompleteBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchingForm = document.getElementById("searchBook");

  searchingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("incompleteBookshelfList");
  const listCompleted = document.getElementById("completeBookshelfList");

  // clearing list item
  uncompletedBookList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBookshelf(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});

document.addEventListener(SEARCH_EVENT, function () {
  const uncompletedBookList = document.getElementById("incompleteBookshelfList");
  const listCompleted = document.getElementById("completeBookshelfList");

  uncompletedBookList.innerHTML = "";
  listCompleted.innerHTML = "";

  const BookTitle = document.getElementById("searchBookTitle").value;

  for (const bookItem of books) {
    const bookElement = makeBookshelf(bookItem);
    if (bookItem.bookTitle.toLowerCase().includes(BookTitle.toLowerCase())) {
      if (bookItem.isCompleted) {
        listCompleted.append(bookElement);
      } else {
        uncompletedBookList.append(bookElement);
      }
    }
  }
});

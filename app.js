// Database User Sederhana (Simulasi)
const users = [
    {
        username: "admin",
        password: "1234",
        role: "admin"
    },
    {
        username: "user",
        password: "1234",
        role: "user"
    }
];

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const error = document.getElementById("error");

    const userFound = users.find(
        user =>
            user.username === username &&
            user.password === password &&
            user.role === role
    );

    if (!userFound) {
        error.textContent = "Login Gagal! Data tidak sesuai.";
        error.style.color = "red";
        return;
    }

    // Simpan session
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);

    if (role === "admin") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "user.html";
    }
}

// Ambil data buku dari localStorage
let books = JSON.parse(localStorage.getItem("books")) || [];

// Tambah Buku
function addBook() {
    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("bookAuthor").value;
    const image = document.getElementById("bookImage").value || "images/default.jpg";
    const loading = document.getElementById("loading");

    if (title === "" || author === "") {
        alert("Isi semua data buku!");
        return;
    }

    loading.style.display = "block";

    setTimeout(() => {

        const newBook = {
    id: Date.now(),
    title: title,
    author: author,
    image: image
    };
        books.push(newBook);
        localStorage.setItem("books", JSON.stringify(books));

        document.getElementById("bookTitle").value = "";
        document.getElementById("bookAuthor").value = "";

        loading.style.display = "none";

        loadBooks();

    }, 800);
}

function loadBooks() {

    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";

    books = JSON.parse(localStorage.getItem("books")) || [];

    books.forEach(book => {

      bookList.innerHTML += `
        <div class="book-card">

    <<img class="book-cover" src="${book.image}" />

    <div class="book-title">
        ${escapeHTML(book.title)}
    </div>

    <div class="book-author">
        ✍ ${book.author}
    </div>

    <div class="book-actions">
        <button class="edit" onclick="editBook(${book.id})">Edit</button>
        <button onclick="deleteBook(${book.id})">Delete</button>
    </div>

</div>
`;
    });

    // 🔥 Pindahkan ke luar loop
    updateStats();
}

function updateStats(){
    const total = books.length;

    // Kita anggap buku hari ini = buku yang dibuat hari ini
    const today = new Date().toDateString();

    const todayBooks = books.filter(book => {
        return new Date(book.id).toDateString() === today;
    }).length;

    document.getElementById("totalBooks").innerText = total;
    document.getElementById("todayBooks").innerText = todayBooks;
}

function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "index.html";
}

function deleteBook(id){
    books = books.filter(book => book.id !== id);
    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
}

function editBook(id){
    const book = books.find(b => b.id === id);

    const newTitle = prompt("Edit Judul Buku", book.title);
    const newAuthor = prompt("Edit Penulis", book.author);

    if(newTitle && newAuthor){
        book.title = newTitle;
        book.author = newAuthor;

        localStorage.setItem("books", JSON.stringify(books));
        loadBooks();
    }
}

function showAddBook(){
    document.getElementById("bookForm").style.display = "block";
    document.getElementById("bookList").style.display = "none";
}

function showBookList(){
    document.getElementById("bookForm").style.display = "none";
    document.getElementById("bookList").style.display = "grid";
}

function searchBook(){
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".book-card");

    cards.forEach(card => {
        const title = card.querySelector("strong").innerText.toLowerCase();

        if(title.includes(keyword)){
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

function loadUserBooks(){

    const books = JSON.parse(localStorage.getItem("books")) || [];
    const userList = document.getElementById("userBookList");

    if(!userList) return;

    userList.innerHTML = "";

    books.forEach(book => {

        userList.innerHTML += `
        <div class="book-card">

            <img class="book-cover" src="${book.image}" />

            <div class="book-title">
                <a href="detail.html?title=${book.title}&author=${book.author}">
                   ${escapeHTML(book.title)}
                </a>
            </div>

            <div class="book-author">
                ✍ ${book.author}
            </div>

        </div>
        `;
    });
}

function escapeHTML(text){
    if(!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
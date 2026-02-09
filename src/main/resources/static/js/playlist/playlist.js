const playlists = [
    { title: "Lofi Beats", tracks: 42, cover: "https://picsum.photos/200?random=1" },
    { title: "Deep Focus", tracks: 18, cover: "https://picsum.photos/200?random=2" },
    { title: "Workout Mix", tracks: 25, cover: "https://picsum.photos/200?random=3" }
];

const footballBtn = document.getElementById("footballBtn");
const footballList = document.getElementById("footballList");

footballBtn.addEventListener("click", () => {
    footballList.classList.toggle("hidden");
});


// playlist creation

    let playlistId = 0;

    const popup = document.getElementById("popup");
    const addBtn = document.getElementById("add-btn");
    const closeBtn = document.getElementById("closePopup");
    const createBtn = document.getElementById("createPlaylist");

    addBtn.onclick = () => popup.classList.remove("hidden");
    closeBtn.onclick = () => popup.classList.add("hidden");

    createBtn.onclick = () => {
    const name = document.getElementById("playlistName").value.trim();
    const items = document.getElementById("subItems").value.trim();

    if (!name || !items) {
    alert("Please fill all fields");
    return;
}

    playlistId++;

    // title
    const title = document.createElement("div");
    title.className = "menu-title";
    title.textContent = name + " ▼";

    // list
    const ul = document.createElement("ul");
    ul.className = "menu-list hidden";

    items.split(",").forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.trim();
    ul.appendChild(li);
});

    title.onclick = () => ul.classList.toggle("hidden");

    const sidebar = document.querySelector(".sidebar");
    sidebar.insertBefore(title, addBtn);
    sidebar.insertBefore(ul, addBtn);

    // reset & close
    document.getElementById("playlistName").value = "";
    document.getElementById("subItems").value = "";
    popup.classList.add("hidden");
};

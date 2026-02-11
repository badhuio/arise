const popup = document.getElementById("popup");
const contentPopup = document.getElementById("content-popup");
const addBtn = document.getElementById("add-btn");
const saveContentBtn = document.getElementById("saveContent");
const playlistContainer = document.getElementById("playlists-container");
const grid = document.getElementById("playlist-grid");

const contentType = document.getElementById("contentType");
const fileInput = document.getElementById("fileInput");
const linkInput = document.getElementById("contentSource");

// ================================
// Input Switching (NO TOGGLE BUTTON)
// ================================
contentType.onchange = () => {
    if (contentType.value === "link") {
        fileInput.classList.add("hidden");
        linkInput.classList.remove("hidden");
    } else {
        fileInput.classList.remove("hidden");
        linkInput.classList.add("hidden");
    }
};

addBtn.onclick = () => popup.classList.remove("hidden");
document.getElementById("closePopup").onclick = () => popup.classList.add("hidden");
document.getElementById("closeContentPopup").onclick = () => contentPopup.classList.add("hidden");

// ================================
// Content Card Rendering
// ================================
function renderContentCard(title, type, source) {
    const card = document.createElement("div");
    card.className = "content-card";

    let icon = "📄";
    let mediaHTML = "";
    let openLink = source; // for Open button

    // 🎵 MUSIC
    if (type === "music") {
        icon = "🎵";
        mediaHTML = `
            <audio controls style="width:100%;">
                <source src="${source}">
                Your browser does not support audio.
            </audio>
        `;
    }

    // 🎥 VIDEO
    else if (type === "video") {
        icon = "🎥";

        // YouTube detection
        if (source.includes("youtube.com/watch?v=")) {
            const videoId = source.split("v=")[1].split("&")[0];
            source = `https://www.youtube.com/embed/${videoId}`;
            openLink = `https://www.youtube.com/watch?v=${videoId}`;
        }

        if (source.includes("youtu.be/")) {
            const videoId = source.split("youtu.be/")[1];
            source = `https://www.youtube.com/embed/${videoId}`;
            openLink = `https://www.youtube.com/watch?v=${videoId}`;
        }

        mediaHTML = `
            <iframe 
                src="${source}" 
                width="100%" 
                height="200" 
                frameborder="0" 
                allowfullscreen>
            </iframe>
        `;
    }

    // 🖼️ PHOTO
    else if (type === "photo") {
        icon = "🖼️";
        mediaHTML = `
            <img src="${source}" style="width:100%; border-radius:8px;">
        `;
    }

    // 📄 DOCUMENT
    else if (type === "document") {
        icon = "📄";
        mediaHTML = `
            <iframe 
                src="${source}" 
                width="100%" 
                height="200">
            </iframe>
        `;
    }

    // 🔗 LINK
    else if (type === "link") {
        icon = "🔗";

        if (source.includes("youtube.com") || source.includes("youtu.be")) {
            let videoId = "";

            if (source.includes("watch?v=")) {
                videoId = source.split("v=")[1].split("&")[0];
            } else if (source.includes("youtu.be/")) {
                videoId = source.split("youtu.be/")[1];
            }

            source = `https://www.youtube.com/embed/${videoId}`;
            openLink = `https://www.youtube.com/watch?v=${videoId}`;

            mediaHTML = `
                <iframe 
                    src="${source}" 
                    width="100%" 
                    height="200"
                    frameborder="0"
                    allowfullscreen>
                </iframe>
            `;
        } else {
            mediaHTML = `
                <div style="
                    padding:20px;
                    background:#1e293b;
                    border-radius:8px;
                    text-align:center;">
                    Website preview not allowed.<br>
                    Click Open to visit.
                </div>
            `;
        }
    }

    card.innerHTML = `
        <div class="card-type">${icon} ${type}</div>
        <div class="card-title">${title}</div>
        ${mediaHTML}
        <div style="margin-top:15px; display:flex; gap:10px;">
            <a href="${openLink}" target="_blank" class="card-btn">Open</a>
            <button class="card-btn edit-card" style="background:#475569;">✎</button>
            <button class="card-btn" style="background:var(--danger);" 
                onclick="this.closest('.content-card').remove()">×</button>
        </div>
    `;

    card.querySelector(".edit-card").onclick = () => {
        const newTitle = prompt("Edit Title:", title);
        if (newTitle) card.querySelector(".card-title").textContent = newTitle;
    };

    grid.appendChild(card);
}

// ================================
// Save Content
// ================================
saveContentBtn.onclick = () => {
    let title = document.getElementById("contentTitle").value;
    const type = contentType.value;
    let source = "";

    if (type === "link") {
        source = linkInput.value.trim();
    } else {
        const file = fileInput.files[0];
        if (file) {
            source = URL.createObjectURL(file);
            if (!title) title = file.name;
        }
    }

    if (!source) return alert("Please provide a file or link.");

    renderContentCard(title || "Untitled", type, source);
    contentPopup.classList.add("hidden");

    // Reset inputs
    document.getElementById("contentTitle").value = "";
    fileInput.value = "";
    linkInput.value = "";
};

// ================================
// Playlist Sidebar
// ================================
function createPlaylistItem(name, itemsArray) {
    const container = document.createElement("div");
    container.className = "playlist-item-container";

    const header = document.createElement("div");
    header.className = "menu-header";
    header.innerHTML = `
        <div class="menu-title">
            <span class="pl-name">${name}</span>
            <span class="arrow">▼</span>
        </div>
        <div class="item-actions">
            <button class="icon-btn add-sub-btn">+</button>
            <button class="icon-btn edit-pl">✎</button>
            <button class="icon-btn del-pl" style="background:var(--danger)">×</button>
        </div>
    `;

    const ul = document.createElement("ul");
    ul.className = "menu-list hidden";

    const renderSubItem = (text) => {
        if (!text.trim()) return;
        const li = document.createElement("li");
        li.className = "sub-item";
        li.innerHTML = `
            <span class="sub-text">${text}</span>
            <div style="display:flex; gap:5px;">
                <button class="sub-icon-btn add-content-btn">+</button>
                <button class="sub-icon-btn del-sub" style="color:var(--danger)">×</button>
            </div>
        `;

        li.querySelector(".add-content-btn").onclick = (e) => {
            e.stopPropagation();
            contentPopup.classList.remove("hidden");
        };

        li.querySelector(".del-sub").onclick = (e) => {
            e.stopPropagation();
            li.remove();
        };

        ul.appendChild(li);
    };

    itemsArray.forEach(item => renderSubItem(item));

    header.querySelector(".menu-title").onclick = () => {
        const isHidden = ul.classList.toggle("hidden");
        header.querySelector(".arrow").textContent = isHidden ? "▼" : "▲";
    };

    header.querySelector(".add-sub-btn").onclick = (e) => {
        e.stopPropagation();
        const newSub = prompt("Enter new sub-heading name:");
        if (newSub) {
            renderSubItem(newSub);
            ul.classList.remove("hidden");
            header.querySelector(".arrow").textContent = "▲";
        }
    };

    header.querySelector(".edit-pl").onclick = (e) => {
        e.stopPropagation();
        const newName = prompt("Rename Playlist:", name);
        if (newName) header.querySelector(".pl-name").textContent = newName;
    };

    header.querySelector(".del-pl").onclick = (e) => {
        e.stopPropagation();
        if (confirm("Delete this entire playlist?")) container.remove();
    };

    container.appendChild(header);
    container.appendChild(ul);
    playlistContainer.appendChild(container);
}

document.getElementById("createPlaylist").onclick = () => {
    const name = document.getElementById("playlistName").value.trim();
    const subsText = document.getElementById("subItems").value.trim();
    const subs = subsText ? subsText.split(",") : [];

    if (!name) return alert("Enter a name");

    createPlaylistItem(name, subs);

    document.getElementById("playlistName").value = "";
    document.getElementById("subItems").value = "";
    popup.classList.add("hidden");
};

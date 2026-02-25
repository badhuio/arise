const popup = document.getElementById("popup");
const contentPopup = document.getElementById("content-popup");
const addBtn = document.getElementById("add-btn");
const saveContentBtn = document.getElementById("saveContent");
const playlistContainer = document.getElementById("playlists-container");
const grid = document.getElementById("playlist-grid");

const contentType = document.getElementById("contentType");
const fileInput = document.getElementById("fileInput");
const linkInput = document.getElementById("contentSource");
const contentTitleInput = document.getElementById("contentTitle");

let currentPlaylistId = null;
let currentPlaylistName = "";

// ───────────────────────────────────────────────
// Input Switching
// ───────────────────────────────────────────────
contentType.onchange = () => {
    if (contentType.value === "link") {
        fileInput.classList.add("hidden");
        linkInput.classList.remove("hidden");
    } else {
        fileInput.classList.remove("hidden");
        linkInput.classList.add("hidden");
    }
};

// Show selected filename
fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file) {
        linkInput.placeholder = `Selected: ${file.name}`;
    }
};

// ───────────────────────────────────────────────
// Popup controls
// ───────────────────────────────────────────────
addBtn.onclick = () => popup.classList.remove("hidden");
document.getElementById("closePopup").onclick = () => popup.classList.add("hidden");
document.getElementById("closeContentPopup").onclick = () => contentPopup.classList.add("hidden");

// ───────────────────────────────────────────────
// Content Card Rendering
// ───────────────────────────────────────────────
function renderContentCard({id, title, type, source}) {
    const card = document.createElement("div");
    card.className = "content-card";
    card.dataset.contentId = id || "";

    let icon = "📄";
    let mediaHTML = "";
    let openLink = source;

    // YouTube helper
    const getYouTubeEmbed = (url) => {
        let videoId = "";
        if (url.includes("youtube.com/watch?v=")) {
            videoId = url.split("v=")[1]?.split("&")[0];
        } else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1]?.split("?")[0];
        }
        if (videoId) {
            openLink = `https://www.youtube.com/watch?v=${videoId}`;
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return null;
    };

    if (type === "music") {
        icon = "🎵";
        mediaHTML = `<audio controls style="width:100%;"><source src="${source}"></audio>`;
    }
    else if (type === "video") {
        icon = "🎥";
        const embed = getYouTubeEmbed(source) || source;
        mediaHTML = `<iframe src="${embed}" width="100%" height="200" frameborder="0" allowfullscreen></iframe>`;
    }
    else if (type === "photo") {
        icon = "🖼️";
        mediaHTML = `<img src="${source}" style="width:100%; border-radius:8px;">`;
    }
    else if (type === "document") {
        icon = "📄";
        mediaHTML = `<iframe src="${source}" width="100%" height="200"></iframe>`;
    }
    else if (type === "link") {
        icon = "🔗";
        const ytEmbed = getYouTubeEmbed(source);
        if (ytEmbed) {
            mediaHTML = `<iframe src="${ytEmbed}" width="100%" height="200" frameborder="0" allowfullscreen></iframe>`;
        } else {
            mediaHTML = `<div style="padding:20px; background:#1e293b; border-radius:8px; text-align:center;">
                No preview available<br>Click Open to visit
            </div>`;
        }
    }

    card.innerHTML = `
        <div class="card-type">${icon} ${type}</div>
        <div class="card-title">${title}</div>
        ${mediaHTML}
        <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">
            <a href="${openLink}" target="_blank" class="card-btn">Open</a>
            <button class="card-btn edit-card" style="background:#475569;">✎ Edit</button>
            <button class="card-btn delete-card" style="background:var(--danger);">× Delete</button>
        </div>
    `;

    // Edit title (client-side for now)
    card.querySelector(".edit-card").onclick = () => {
        const newTitle = prompt("New title:", title);
        if (newTitle?.trim()) {
            card.querySelector(".card-title").textContent = newTitle.trim();
            // TODO: send to backend (PUT /content/${id})
        }
    };

    // Delete (client + future backend)
    card.querySelector(".delete-card").onclick = () => {
        if (!confirm("Delete this item?")) return;
        const contentId = card.dataset.contentId;
        if (contentId) {
            // TODO: implement real delete
            // $.ajax({ url: `/content/${contentId}`, method: "DELETE", success: () => card.remove() });
            console.warn("Delete not implemented on server yet");
        }
        card.remove();
    };

    grid.appendChild(card);
}

// ───────────────────────────────────────────────
// Save Content
// ───────────────────────────────────────────────
saveContentBtn.onclick = () => {
    if (!currentPlaylistId) {
        alert("Please select a playlist first!");
        return;
    }

    const title = contentTitleInput.value.trim();
    const type = contentType.value;
    const link = linkInput.value.trim();
    const file = fileInput.files[0];

    if (!title) return alert("Please enter a title");

    if (type !== "link" && !file) {
        return alert("Please select a file");
    }
    if (type === "link" && !link) {
        return alert("Please enter a link/URL");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("playlistId", currentPlaylistId);

    if (type === "link") {
        formData.append("source", link);
    } else {
        formData.append("file", file);
    }

    $.ajax({
        url: "/saveContent",
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: (response) => {
            alert("Content added!");
            contentPopup.classList.add("hidden");
            contentTitleInput.value = "";
            fileInput.value = "";
            linkInput.value = "";
            // Reload current playlist content
            loadContentForPlaylist(currentPlaylistId);
        },
        error: (xhr) => {
            alert("Error: " + (xhr.responseText || "Could not save content"));
            console.error(xhr);
        }
    });
};

// ───────────────────────────────────────────────
// Playlist Item Creation
// ───────────────────────────────────────────────
function createPlaylistItem(name, subs = [], playlistId) {
    const container = document.createElement("div");
    container.className = "playlist-item-container";
    container.dataset.playlistId = playlistId;

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
        if (!text?.trim()) return;
        const li = document.createElement("li");
        li.className = "sub-item";
        li.innerHTML = `
            <span class="sub-text">${text.trim()}</span>
            <div style="display:flex; gap:5px;">
                <button class="sub-icon-btn add-content-btn">+</button>
                <button class="sub-icon-btn del-sub" style="color:var(--danger)">×</button>
            </div>
        `;

        li.querySelector(".add-content-btn").onclick = (e) => {
            e.stopPropagation();
            if (!currentPlaylistId) {
                alert("Select playlist first");
                return;
            }
            contentPopup.classList.remove("hidden");
        };

        li.querySelector(".del-sub").onclick = (e) => {
            e.stopPropagation();
            li.remove();
        };

        ul.appendChild(li);
    };

    subs.forEach(renderSubItem);

    // Click to open playlist → load its content
    header.querySelector(".menu-title").onclick = (e) => {
        e.stopPropagation();

        // Remove active from others
        document.querySelectorAll(".playlist-item-container").forEach(el => {
            el.classList.remove("active");
        });
        container.classList.add("active");

        currentPlaylistId = playlistId;
        currentPlaylistName = name;

        const isHidden = ul.classList.toggle("hidden");
        header.querySelector(".arrow").textContent = isHidden ? "▼" : "▲";

        // Load content for this playlist
        loadContentForPlaylist(playlistId);
    };

    header.querySelector(".add-sub-btn").onclick = (e) => {
        e.stopPropagation();
        const newSub = prompt("New sub-heading:");
        if (newSub?.trim()) {
            renderSubItem(newSub);
            ul.classList.remove("hidden");
            header.querySelector(".arrow").textContent = "▲";
        }
    };

    header.querySelector(".edit-pl").onclick = (e) => {
        e.stopPropagation();
        const newName = prompt("Rename playlist:", name);
        if (newName?.trim()) {
            header.querySelector(".pl-name").textContent = newName.trim();
            // TODO: send rename to backend
        }
    };

    header.querySelector(".del-pl").onclick = (e) => {
        e.stopPropagation();
        if (confirm(`Delete playlist "${name}"?`)) {
            container.remove();
            if (currentPlaylistId === playlistId) {
                currentPlaylistId = null;
                grid.innerHTML = "<p style='text-align:center; color:#94a3b8;'>Select a playlist</p>";
            }
            // TODO: send delete to backend
        }
    };

    container.append(header, ul);
    playlistContainer.appendChild(container);
}

// ───────────────────────────────────────────────
// Load Playlists
// ───────────────────────────────────────────────
function loadPlaylistsFromDB() {
    $.ajax({
        url: "/getPlaylists",
        method: "GET",
        success: (playlists) => {
            playlistContainer.innerHTML = "";
            playlists.forEach(pl => {
                createPlaylistItem(pl.name, pl.subs || [], pl.id);
            });
            if (playlists.length === 0) {
                playlistContainer.innerHTML = "<p style='color:#94a3b8; text-align:center;'>No playlists yet</p>";
            }
        },
        error: () => {
            playlistContainer.innerHTML = "<p style='color:#ef4444;'>Error loading playlists</p>";
        }
    });
}

// ───────────────────────────────────────────────
// Load Content FOR ONE PLAYLIST
// ───────────────────────────────────────────────
function loadContentForPlaylist(playlistId) {
    if (!playlistId) return;

    grid.innerHTML = "<p style='text-align:center; color:#94a3b8;'>Loading...</p>";

    $.ajax({
        url: `/getContents/${playlistId}`,
        method: "GET",
        success: (contents) => {
            grid.innerHTML = "";
            if (contents.length === 0) {
                grid.innerHTML = "<p style='text-align:center; color:#94a3b8;'>No content in this playlist yet</p>";
            }
            contents.forEach(item => renderContentCard(item));
        },
        error: () => {
            grid.innerHTML = "<p style='color:#ef4444; text-align:center;'>Error loading content</p>";
        }
    });
}

// ───────────────────────────────────────────────
// Create Playlist
// ───────────────────────────────────────────────
document.getElementById("createPlaylist").onclick = () => {
    const name = document.getElementById("playlistName").value.trim();
    const subsText = document.getElementById("subItems").value.trim();
    const subs = subsText ? subsText.split(",").map(s => s.trim()).filter(Boolean) : [];

    if (!name) return alert("Enter playlist name");

    $.ajax({
        url: "/sendPlayList",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ name, subs }),
        success: () => {
            loadPlaylistsFromDB();
            popup.classList.add("hidden");
            document.getElementById("playlistName").value = "";
            document.getElementById("subItems").value = "";
        },
        error: (err) => {
            alert("Could not create playlist");
            console.error(err);
        }
    });
};

// ───────────────────────────────────────────────
// Init
// ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    loadPlaylistsFromDB();
    // Do NOT auto-load all content anymore — wait for playlist selection
    grid.innerHTML = "<p style='text-align:center; color:#94a3b8; padding:40px;'>Select a playlist to view content</p>";
});
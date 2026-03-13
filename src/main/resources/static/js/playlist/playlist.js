// playlist-ui.js

// ─── DOM Elements ────────────────────────────────────────────────
const popup                 = document.getElementById("popup");
const contentPopup          = document.getElementById("content-popup");
const subheadingPopup       = document.getElementById("subheading-popup");
const addBtn                = document.getElementById("add-btn");
const saveContentBtn        = document.getElementById("saveContent");
const playlistContainer     = document.getElementById("playlists-container");
const grid                  = document.getElementById("playlist-grid");

const contentType           = document.getElementById("contentType");
const fileInput             = document.getElementById("fileInput");
const linkInput             = document.getElementById("contentSource");
const contentTitleInput     = document.getElementById("contentTitle");

let currentPlaylistId       = null;
let currentPlaylistName     = "";


// ─── Input Switching + File name preview ─────────────────────────
contentType.onchange = () => {
    if (contentType.value === "link") {
        fileInput.classList.add("hidden");
        linkInput.classList.remove("hidden");
    } else {
        fileInput.classList.remove("hidden");
        linkInput.classList.add("hidden");
    }
};

fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file) {
        linkInput.placeholder = `Selected: ${file.name}`;
    }
};


// ─── Popup controls ──────────────────────────────────────────────
addBtn.onclick = () => popup.classList.remove("hidden");
document.getElementById("closePopup").onclick = () => popup.classList.add("hidden");
document.getElementById("closeContentPopup").onclick = () => contentPopup.classList.add("hidden");

document.getElementById("closeSubheadingPopup").onclick = () => {
    subheadingPopup.classList.add("hidden");
};


// ─── Pure UI: Render single content card ─────────────────────────
function renderContentCard({ id, title, type, source }) {
    const card = document.createElement("div");
    card.className = "content-card";
    card.dataset.contentId = id || "";

    let icon = "📄";
    let mediaHTML = "";
    let openLink = source;

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

    card.querySelector(".edit-card").onclick = () => {
        const newTitle = prompt("New title:", title);
        if (newTitle?.trim()) {
            card.querySelector(".card-title").textContent = newTitle.trim();
            // TODO: save new title to backend if id exists
        }
    };

    card.querySelector(".delete-card").onclick = () => {
        if (!confirm("Delete this item?")) return;
        const contentId = card.dataset.contentId;
        if (contentId) {
            deleteContent(contentId, () => card.remove());
        } else {
            card.remove();
        }
    };

    grid.appendChild(card);
}


// ─── Pure UI: Create playlist item with sub-items ────────────────
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

    const renderSubItem = (text, subId = null) => {
        if (!text?.trim()) return;

        const li = document.createElement("li");
        li.className = "sub-item";
        if (subId) li.dataset.subId = subId;

        li.innerHTML = `
            <span class="sub-text">${text.trim()}</span>
            <div style="display:flex; gap:5px;">
                <button class="sub-icon-btn add-content-btn">+</button>
                <button class="sub-icon-btn del-sub" class="del-sub" style="color:var(--danger)">×</button>
            </div>
        `;

        li.querySelector(".add-content-btn").onclick = (e) => {
            e.stopPropagation();
            if (!currentPlaylistId) {
                alert("Select a playlist first");
                return;
            }
            contentPopup.classList.remove("hidden");
            // TODO: you might want to store which subheading was clicked
            // e.g. currentSubheadingId = subId;
        };

        li.querySelector(".del-sub").onclick = (e) => {
            e.stopPropagation();

            const subId = li.dataset.subId;

            if (subId) {
                if (!confirm("Delete this subheading?")) return;
                deleteSubheading(subId, () => li.remove());
            } else {
                li.remove();
            }
        };

        ul.appendChild(li);
    };

    // Render existing subheadings (with IDs if from DB)
    subs.forEach(sub => {
        // Expecting sub = { title: "...", id: "..." } or just string
        if (typeof sub === "string") {
            renderSubItem(sub);
        } else {
            renderSubItem(sub.title || sub.name, sub.id || sub._id);
        }
    });

    // ─── Select playlist ─────────────────────────────────────────
    header.querySelector(".menu-title").onclick = (e) => {
        e.stopPropagation();

        document.querySelectorAll(".playlist-item-container").forEach(el => el.classList.remove("active"));
        container.classList.add("active");

        currentPlaylistId = playlistId;
        currentPlaylistName = name;

        const isHidden = ul.classList.toggle("hidden");
        header.querySelector(".arrow").textContent = isHidden ? "▼" : "▲";

        loadContentForPlaylist(playlistId);
    };

    // ─── Add sub-heading (with popup) ────────────────────────────
    header.querySelector(".add-sub-btn").onclick = (e) => {
        e.stopPropagation();

        const input = document.getElementById("newSubheadingInput");
        const saveBtn = document.getElementById("saveNewSubheading");

        input.value = "";
        subheadingPopup.classList.remove("hidden");
        input.focus();

        const handleSave = () => {
            const newSub = input.value.trim();
            if (newSub) {
                renderSubItem(newSub); // no ID yet → local only
                ul.classList.remove("hidden");
                header.querySelector(".arrow").textContent = "▲";
                // TODO: save to backend → addSubheading(playlistId, newSub, (newId) => {
                //   li.dataset.subId = newId;   // update after save
                // })
            }
            subheadingPopup.classList.add("hidden");
            cleanup();
        };

        const handleKey = (ev) => {
            if (ev.key === "Enter") {
                ev.preventDefault();
                handleSave();
            }
        };

        const cleanup = () => {
            saveBtn.removeEventListener("click", handleSave);
            input.removeEventListener("keydown", handleKey);
            document.getElementById("closeSubheadingPopup").removeEventListener("click", cleanup);
        };

        saveBtn.addEventListener("click", handleSave);
        input.addEventListener("keydown", handleKey);
        document.getElementById("closeSubheadingPopup").addEventListener("click", cleanup);
    };

    // Edit playlist name
    header.querySelector(".edit-pl").onclick = (e) => {
        e.stopPropagation();
        const newName = prompt("Rename playlist:", name);
        if (newName?.trim()) {
            header.querySelector(".pl-name").textContent = newName.trim();
            // TODO: renamePlaylist(playlistId, newName.trim())
        }
    };

    // Delete playlist
    header.querySelector(".del-pl").onclick = (e) => {
        e.stopPropagation();
        if (!confirm(`Delete playlist "${name}"?`)) return;

        deletePlaylist(playlistId, () => {
            container.remove();
            if (currentPlaylistId === playlistId) {
                currentPlaylistId = null;
                grid.innerHTML = "<p style='text-align:center; color:#94a3b8;'>Select a playlist</p>";
            }
        });
    };


    //Delete Subheadings
     header.querySelector(".del-pl").onclick = (e) => {
            e.stopPropagation();
            if (!confirm(`Delete playlist "${name}"?`)) return;

            deletePlaylist(playlistId, () => {
                container.remove();
                if (currentPlaylistId === playlistId) {
                    currentPlaylistId = null;
                    grid.innerHTML = "<p style='text-align:center; color:#94a3b8;'>Select a playlist</p>";
                }
            });
        };

    container.append(header, ul);
    playlistContainer.appendChild(container);
}


// ─── Init ────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    loadPlaylistsFromDB();
    grid.innerHTML = "<p style='text-align:center; color:#94a3b8; padding:40px;'>Select a playlist to view content</p>";
});
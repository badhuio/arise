// playlist-ui.js

/* ════════════════════════════════════════════════════════════════
   1. DOM Elements
   ════════════════════════════════════════════════════════════════ */
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


/* ════════════════════════════════════════════════════════════════
   2. Global Variables
   ════════════════════════════════════════════════════════════════ */
let currentPlaylistId       = null;
let currentPlaylistName     = "";
let currentSubheadingId     = null; // tracks which subheading "Add content" was clicked from


/* ════════════════════════════════════════════════════════════════
   3. Event Listeners
   ════════════════════════════════════════════════════════════════ */

// ─── contentType.onchange ─────────────────────────────────────────
contentType.onchange = () => {
    if (contentType.value === "link") {
        fileInput.classList.add("hidden");
        linkInput.classList.remove("hidden");
    } else {
        fileInput.classList.remove("hidden");
        linkInput.classList.add("hidden");
    }
};

// ─── fileInput.onchange ───────────────────────────────────────────
fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file) {
        linkInput.placeholder = `Selected: ${file.name}`;
    }
};

// ─── addBtn.onclick ───────────────────────────────────────────────
addBtn.onclick = () => popup.classList.remove("hidden");

// ─── close popup buttons ──────────────────────────────────────────
document.getElementById("closePopup").onclick = () => popup.classList.add("hidden");
document.getElementById("closeContentPopup").onclick = () => contentPopup.classList.add("hidden");
document.getElementById("closeSubheadingPopup").onclick = () => subheadingPopup.classList.add("hidden");

// ─── DOMContentLoaded ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    loadPlaylistsFromDB();
    grid.innerHTML = "<p style='text-align:center; color:#94a3b8; padding:40px;'>Select a playlist to view content</p>";
});


/* ════════════════════════════════════════════════════════════════
   4. Utility Functions
   ════════════════════════════════════════════════════════════════ */

// ─── editPopup() ───────────────────────────────────────────────────
function editPopup() {
    const editPopup = document.getElementById("editPopup");
    editPopup.classList.remove("hidden");
}

// ─── closePopup() ──────────────────────────────────────────────────
function closePopup() {
    const editPopup = document.getElementById("editPopup");
    editPopup.classList.add("hidden");
}

// ─── getYouTubeEmbed() ─────────────────────────────────────────────
// Returns { embedUrl, openLink } for a YouTube URL, or null if not YouTube.
function getYouTubeEmbed(url) {
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    if (videoId) {
        return {
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            openLink: `https://www.youtube.com/watch?v=${videoId}`
        };
    }
    return null;
}


/* ════════════════════════════════════════════════════════════════
   5. UI Render Functions
   ════════════════════════════════════════════════════════════════ */

// ─── renderContentCard() ───────────────────────────────────────────
function renderContentCard({ id, title, type, source }) {
    const card = document.createElement("div");
    card.className = "content-card";
    card.dataset.contentId = id || "";

    let icon = "📄";
    let mediaHTML = "";
    let openLink = source;

    if (type === "music") {
        icon = "🎵";
        mediaHTML = `<audio controls style="width:100%;"><source src="${source}"></audio>`;
    }
    else if (type === "video") {
        icon = "🎥";
        const yt = getYouTubeEmbed(source);
        const embed = yt ? yt.embedUrl : source;
        if (yt) openLink = yt.openLink;
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
        const yt = getYouTubeEmbed(source);
        if (yt) {
            openLink = yt.openLink;
            mediaHTML = `<iframe src="${yt.embedUrl}" width="100%" height="200" frameborder="0" allowfullscreen></iframe>`;
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

    card.querySelector(".edit-card").onclick = () => editContent(card);
    card.querySelector(".delete-card").onclick = () => deleteContentCard(card);

    grid.appendChild(card);
}

// ─── renderSubItem() ────────────────────────────────────────────────
// Moved outside createPlaylistItem. Takes the parent <ul> + playlistId
// as context so it can be reused/called independently of the closure.
function renderSubItem(ul, playlistId, text, subId = null) {
    if (!text?.trim()) return;

    const li = document.createElement("li");
    li.className = "sub-item";
    li.dataset.playlistId = playlistId;
    if (subId) li.dataset.subId = subId;

    li.innerHTML = `
        <span class="sub-text">${text.trim()}</span>
        <div style="display:flex; gap:5px;">
            <button class="sub-icon-btn add-content-btn">+</button>
            <button class="icon-btn edit-pl">✎</button>
            <button class="sub-icon-btn del-sub" style="color:var(--danger)">×</button>
        </div>
    `;

    li.querySelector(".add-content-btn").onclick = (e) => {
        e.stopPropagation();
        addContentToSubheading(li);
    };

    li.querySelector(".edit-pl").onclick = (e) => {
        e.stopPropagation();
        editSubheading(li);
    };

    li.querySelector(".del-sub").onclick = (e) => {
        e.stopPropagation();
        deleteSubheadingItem(li);
    };

    ul.appendChild(li);
    return li;
}

// ─── createPlaylistItem() ───────────────────────────────────────────
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

    // Render existing subheadings (with IDs if from DB)
    subs.forEach(sub => {
        // Expecting sub = { title: "...", id: "..." } or just string
        if (typeof sub === "string") {
            renderSubItem(ul, playlistId, sub);
        } else {
            renderSubItem(ul, playlistId, sub.title || sub.name, sub.id || sub._id);
        }
    });

    header.querySelector(".menu-title").onclick = (e) => {
        e.stopPropagation();
        selectPlaylist(container, header, ul, playlistId, name);
    };

    header.querySelector(".add-sub-btn").onclick = (e) => {
        e.stopPropagation();
        addSubheadingPopupFlow(ul, header, playlistId);
    };

    header.querySelector(".edit-pl").onclick = (e) => {
        e.stopPropagation();
        editPlaylistName(header, playlistId);
    };

    header.querySelector(".del-pl").onclick = (e) => {
        e.stopPropagation();
        deletePlaylistItem(container, playlistId, name);
    };

    container.append(header, ul);
    playlistContainer.appendChild(container);
}


/* ════════════════════════════════════════════════════════════════
   6. Playlist Actions
   ════════════════════════════════════════════════════════════════ */

// ─── Select Playlist ─────────────────────────────────────────────
function selectPlaylist(container, header, ul, playlistId, name) {
    document.querySelectorAll(".playlist-item-container").forEach(el => el.classList.remove("active"));
    container.classList.add("active");

    currentPlaylistId = playlistId;
    currentPlaylistName = name;

    const isHidden = ul.classList.toggle("hidden");
    header.querySelector(".arrow").textContent = isHidden ? "▼" : "▲";

    loadContentForPlaylist(playlistId);
}

// ─── Edit Playlist ────────────────────────────────────────────────
function editPlaylistName(header, playlistId) {
    editPopup();

    document.getElementById("saveBtn").onclick = () => {
        const newPlaylistTitle = document.getElementById("editedName").value;
        playlistTitleEdit(playlistId, newPlaylistTitle);
        closePopup();
    };
}

// ─── Delete Playlist ──────────────────────────────────────────────
function deletePlaylistItem(container, playlistId, name) {
    if (!confirm(`Delete playlist "${name}"?`)) return;

    deletePlaylist(playlistId, () => {
        container.remove();
        if (currentPlaylistId === playlistId) {
            currentPlaylistId = null;
            grid.innerHTML = "<p style='text-align:center; color:#94a3b8;'>Select a playlist</p>";
        }
    });
}


/* ════════════════════════════════════════════════════════════════
   7. Subheading Actions
   ════════════════════════════════════════════════════════════════ */

// ─── Add Subheading ───────────────────────────────────────────────
function addSubheadingPopupFlow(ul, header, playlistId) {
    const input = document.getElementById("subItems");
    const addSubheading = document.getElementById("saveSubheading");

    input.value = "";
    subheadingPopup.classList.remove("hidden");
    input.focus();

    const handleSave = () => {
        const newSub = input.value.trim();

        if (!newSub) return;

        // Add to UI
        renderSubItem(ul, playlistId, newSub);

        // Expand playlist
        ul.classList.remove("hidden");
        header.querySelector(".arrow").textContent = "▲";

        // TODO: Save to backend
        // addSubheading(playlistId, newSub);

        cleanup();
        subheadingPopup.classList.add("hidden");
    };

    const handleKey = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        }
    };

    const cleanup = () => {
        saveSubheading.removeEventListener("click", handleSave);
        input.removeEventListener("keydown", handleKey);
        document
            .getElementById("closeSubheadingPopup")
            .removeEventListener("click", cleanup);
    };

    // Prevent duplicate listeners
    cleanup();

    saveSubheading.addEventListener("click", handleSave);
    input.addEventListener("keydown", handleKey);
    document
        .getElementById("closeSubheadingPopup")
        .addEventListener("click", cleanup);
}

// ─── Edit Subheading ──────────────────────────────────────────────
function editSubheading(li) {
    editPopup();

    document.getElementById("editedName").value =
        li.querySelector(".sub-text").textContent;

    document.getElementById("saveSubheading").onclick = (e) => {
        e.preventDefault();

        const newSubheadingTitle = document.getElementById("editedName").value.trim();
        const subId = li.dataset.subId;

        if (!newSubheadingTitle) return;

        // Update UI
        li.querySelector(".sub-text").textContent = newSubheadingTitle;

        // Update backend
        subheadingTitleEdit(subId, newSubheadingTitle);

        closePopup();
    };
}

// ─── Delete Subheading ────────────────────────────────────────────
function deleteSubheadingItem(li) {
    const subId = li.dataset.subId;

    if (subId) {
        if (!confirm("Delete this subheading?")) return;
        deleteSubheading(subId, () => li.remove());
    } else {
        li.remove();
    }
}


/* ════════════════════════════════════════════════════════════════
   8. Content Actions
   ════════════════════════════════════════════════════════════════ */

// ─── Add Content ──────────────────────────────────────────────────
function addContentToSubheading(li) {
    if (!currentPlaylistId) {
        alert("Select a playlist first");
        return;
    }
    currentSubheadingId = li.dataset.subId || null;
    contentPopup.classList.remove("hidden");
}

// ─── Edit Content ─────────────────────────────────────────────────
function editContent(card) {
    const newTitle = editPopup();
    if (newTitle?.trim()) {
        card.querySelector(".card-title").textContent = newTitle.trim();
        // TODO: save new title to backend if id exists
        const contentId = card.dataset.contentId;
        if (contentId) {
            // e.g. updateContentTitle(contentId, newTitle.trim());
        }
    }
}

// ─── Delete Content ───────────────────────────────────────────────
function deleteContentCard(card) {
    if (!confirm("Delete this item?")) return;
    const contentId = card.dataset.contentId;
    if (contentId) {
        deleteContent(contentId, () => card.remove());
    } else {
        card.remove();
    }
}


/* ════════════════════════════════════════════════════════════════
   9. Backend Calls
   (stubs / hooks — implement against your actual API layer)
   ════════════════════════════════════════════════════════════════ */

// ─── loadPlaylistsFromDB() ─────────────────────────────────────────
function loadPlaylistsFromDB() {
    // TODO: fetch playlists from backend, then for each:
    // createPlaylistItem(playlist.name, playlist.subheadings, playlist.id)
}

// ─── loadContentForPlaylist() ──────────────────────────────────────
function loadContentForPlaylist(playlistId) {
    // TODO: fetch content for playlistId from backend, then:
    // grid.innerHTML = "";
    // content.forEach(renderContentCard);
}

// ─── deletePlaylist() ───────────────────────────────────────────────
function deletePlaylist(playlistId, onSuccess) {
    // TODO: call backend DELETE endpoint, then onSuccess() on success
    onSuccess?.();
}

// ─── deleteSubheading() ─────────────────────────────────────────────
function deleteSubheading(subId, onSuccess) {
    // TODO: call backend DELETE endpoint, then onSuccess() on success
    onSuccess?.();
}

// ─── deleteContent() ─────────────────────────────────────────────────
function deleteContent(contentId, onSuccess) {
    // TODO: call backend DELETE endpoint, then onSuccess() on success
    onSuccess?.();
}

// ─── playlistTitleEdit() ──────────────────────────────────────────────
function playlistTitleEdit(playlistId, newTitle) {
//    console.log("new playlist title:", newTitle);
    // TODO: call backend PATCH/PUT endpoint to persist newTitle
}
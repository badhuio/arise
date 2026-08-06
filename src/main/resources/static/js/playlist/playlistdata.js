// playlist-data.js
// Backend/data layer — pairs with playlist-ui.js (UI layer).
// Implements the stubs left in playlist-ui.js section 9.

/* ════════════════════════════════════════════════════════════════
   1. Event Listeners
   ════════════════════════════════════════════════════════════════ */

//saveContentBtn.onclick = saveNewContent;

document.getElementById("createPlaylist").onclick = createNewPlaylist;


/* ════════════════════════════════════════════════════════════════
   2. Content Actions
   ════════════════════════════════════════════════════════════════ */

// ─── Add Content ───────────────────────────────────────────────────
function saveNewContent() {
    if (!currentPlaylistId) {
        alert("Please select a playlist first!");
        return;
    }

    const title = contentTitleInput.value.trim();
    const type  = contentType.value;
    const link  = linkInput.value.trim();
    const file  = fileInput.files[0];

    if (!title) return alert("Please enter a title");
    if (type !== "link" && !file) return alert("Please select a file");
    if (type === "link"  && !link) return alert("Please enter a link/URL");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("playlistId", currentPlaylistId);
    if (currentSubheadingId) {
        formData.append("subheadingId", currentSubheadingId);
    }

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
            console.log("res of save:", response);
            contentPopup.classList.add("hidden");
            contentTitleInput.value = "";
            fileInput.value = "";
            linkInput.value = "";
            currentSubheadingId = null;
            renderContentCard(response);    // ← calls UI layer
        },
        error: (xhr) => {
            alert("Error: " + (xhr.responseText || "Could not save content"));
            console.error(xhr);
        }
    });
}

// ─── Edit Content ───────────────────────────────────────────────────
function updateContentTitle(contentId, newTitle, onSuccess) {
    $.ajax({
        url: `/updateContentTitle/${contentId}`,
        method: "PATCH",
        contentType: "application/json",
        data: JSON.stringify({ title: newTitle }),
        success: () => onSuccess?.(),
        error: (xhr) => {
            console.error("Update content title failed", xhr);
            alert("Failed to update content title");
        }
    });
}

// ─── Delete Content ──────────────────────────────────────────────────
function deleteContent(contentId, onSuccess) {
    $.ajax({
        url: `/deleteContent/${contentId}`,
        method: "DELETE",
        success: () => onSuccess?.(),
        error: (xhr) => {
            console.error("Delete failed", xhr);
            alert("Failed to delete content");
        }
    });
}


/* ════════════════════════════════════════════════════════════════
   3. Playlist Actions
   ════════════════════════════════════════════════════════════════ */

// ─── Load all playlists ──────────────────────────────────────────────
function loadPlaylistsFromDB() {
    $.ajax({
        url: "/getPlaylists",
        method: "GET",
        success: (playlists) => {
            playlists.forEach(pl => {
                if (!document.querySelector(`[data-playlist-id="${pl.id}"]`)) {
                    createPlaylistItem(pl.name, pl.subs || [], pl.id);
                }
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

// ─── Add Playlist ────────────────────────────────────────────────────
function createNewPlaylist() {
    const name     = document.getElementById("playlistName").value.trim();
    const subsText = document.getElementById("subItems").value.trim();
    const subs     = subsText ? subsText.split(",").map(s => s.trim()).filter(Boolean) : [];

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
}

// ─── Edit Playlist ───────────────────────────────────────────────────
// NOTE: original used method "UPDATE", which is not a valid HTTP verb —
// fixed to "PUT", and the success callback (left empty/unclosed in the
// original) now actually does something.
function playlistTitleEdit(playlistId, newPlaylistTitle, onSuccess) {
    $.ajax({
        url: `/playlistTitleEdit/${playlistId}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ title: newPlaylistTitle }),
        success: () => onSuccess?.(),
        error: (xhr) => {
            console.error("Playlist title update failed", xhr);
            alert("Failed to update playlist title");
        }
    });
}

// ─── Delete Playlist ──────────────────────────────────────────────────
function deletePlaylist(playlistId, onSuccess) {
    $.ajax({
        url: `/deletePlaylist/${playlistId}`,
        method: "DELETE",
        success: () => onSuccess?.(),
        error: (xhr) => {
            console.error("Delete failed", xhr);
            alert("Failed to delete playlist");
        }
    });
}

// ─── Load content of one playlist (used when a playlist is selected) ──
function loadContentForPlaylist(playlistId) {
    if (!playlistId) return;

    grid.innerHTML = "<p style='text-align:center; color:#94a3b8;'>Loading...</p>";

    $.ajax({
        url: `/getContents/${playlistId}`,
        method: "GET",
        success: (contents) => {
            grid.innerHTML = "";   // clear loading message
            contents.forEach(item => {
                if (!document.querySelector(`[data-content-id="${item.id}"]`)) {
                    renderContentCard(item);
                }
            });
        },
        error: () => {
            grid.innerHTML = "<p style='color:#ef4444; text-align:center;'>Error loading content</p>";
        }
    });
}


/* ════════════════════════════════════════════════════════════════
   4. Subheading Actions
   ════════════════════════════════════════════════════════════════ */




// ─── Edit Subheading ────────────────────────────────────────────────
// NOTE: original was `d=function subheadTitleEdit(subId, new)`, which is
// invalid JS — "new" is a reserved keyword and can't be a parameter name,
// and "d=function ..." isn't a valid declaration. Fixed below.
function subheadTitleEdit(subId, newTitle, onSuccess) {
    $.ajax({
        url: `/subheadTitleEdit/${subId}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ title: newTitle }),
        success: () => onSuccess?.(),
        error: (xhr) => {
            console.error("Subheading title update failed", xhr);
            alert("Failed to update subheading title");
        }
    });
}

// ─── Delete Subheading ───────────────────────────────────────────────
function deleteSubheading(subId, onSuccess) {
    $.ajax({
        url: `/deleteSubheading/${subId}`,
        method: "DELETE",
        success: () => onSuccess?.(),
        error: (xhr) => {
            console.error(xhr);
            alert("Failed to delete sub item");
        }
    });
}
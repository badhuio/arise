// playlist-data.js

// ─── Save new content ────────────────────────────────────────────
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
            contentPopup.classList.add("hidden");
            contentTitleInput.value = "";
            fileInput.value = "";
            linkInput.value = "";
            renderContentCard(response);    // ← calls UI layer
        },
        error: (xhr) => {
            alert("Error: " + (xhr.responseText || "Could not save content"));
            console.error(xhr);
        }
    });
}

saveContentBtn.onclick = saveNewContent;


// ─── Load all playlists ──────────────────────────────────────────
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


// ─── Load content of one playlist ────────────────────────────────
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


// ─── Create new playlist ─────────────────────────────────────────
document.getElementById("createPlaylist").onclick = () => {
    const name    = document.getElementById("playlistName").value.trim();
    const subsText = document.getElementById("subItems").value.trim();
    const subs    = subsText ? subsText.split(",").map(s => s.trim()).filter(Boolean) : [];

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


// ─── Future placeholders (to be implemented) ─────────────────────
function deleteContent(contentId, onSuccess) {
    // TODO: $.ajax DELETE /content/:id

     $.ajax({
            url : `/deleteContent/${contentId}`,
            method : "DELETE",
            success : () => onSuccess?. (),
            error: (xhr) => {                             // 6
                   console.error("Delete failed", xhr);
                   alert("Failed to delete playlist");
            }
        });

    console.warn("deleteContent not implemented yet");
    onSuccess?.();
}

function deletePlaylist(playlistId, onSuccess) {
    // TODO: $.ajax DELETE /playlist/:id
    $.ajax({
        url : `/deletePlaylist/${playlistId}`,
        method : "DELETE",
        success : () => onSuccess?. (),
        error: (xhr) => {                             // 6
               console.error("Delete failed", xhr);
               alert("Failed to delete playlist");
        }
    });
}

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


//function updateContentTitle(contentId, newTitle) {
//    // TODO: PUT /content/:id { title: newTitle }
//    $.ajax({
//        url: `/updateContentTitle/${contentId}`,
//        method : "PATCH",
//        success :
//    });
//    console.warn("updateContentTitle not implemented yet");
//}
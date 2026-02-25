package com.badhu.service;

import com.badhu.dao.ContentRepository;
import com.badhu.entity.ContentEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@Service
public class ContentService {

    private final ContentRepository contentRepository;

    public ContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    // UPDATED: Added playlistId parameter
    public ContentEntity saveContent(String title, String type, String source,
                                     MultipartFile file, Long playlistId) throws Exception {

        ContentEntity content = new ContentEntity();
        content.setTitle(title);
        content.setType(type);
        content.setPlaylistId(playlistId);  // ADD THIS LINE

        if (file != null && !file.isEmpty()) {
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File dir = new File(uploadDir);

            if (!dir.exists() && !dir.mkdirs()) {
                throw new RuntimeException("Folder creation failed");
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = uploadDir + fileName;

            file.transferTo(new File(filePath));
            content.setSource("/uploads/" + fileName);

        } else {
            content.setSource(source);
        }

        return contentRepository.save(content);
    }

    public List<ContentEntity> getAllContent() {
        return contentRepository.findAll();
    }

    // NEW: For AJAX playlist filtering
    public List<ContentEntity> getContentsByPlaylistId(Long playlistId) {
        return contentRepository.findByPlaylistId(playlistId);
    }
}

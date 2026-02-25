package com.badhu.dao;

import com.badhu.entity.ContentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContentRepository extends JpaRepository<ContentEntity, Long> {
    List<ContentEntity> findByPlaylistId(Long playlistId);  // ADD THIS ONE LINE
}

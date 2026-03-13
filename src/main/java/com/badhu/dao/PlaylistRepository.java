package com.badhu.dao;

import com.badhu.dto.PlaylistDTO;
import com.badhu.entity.PlaylistEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PlaylistRepository extends JpaRepository<PlaylistEntity,Long>{
}


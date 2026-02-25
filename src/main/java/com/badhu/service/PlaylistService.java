package com.badhu.service;

import com.badhu.dao.PlaylistRepository;
import com.badhu.dto.PlaylistDTO;
import com.badhu.entity.PlaylistEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository ;

    public PlaylistService(PlaylistRepository playlistRepository) {
        this.playlistRepository = playlistRepository;
    }


    public Boolean createPlaylist(PlaylistDTO dto) {

    try {
        PlaylistEntity entity = new PlaylistEntity();
        entity.setName(dto.getName());
        entity.setSubs(dto.getSubs());

        System.out.println("Name: " + entity);

        playlistRepository.save(entity);

        return true;
    }catch (Exception e){
        e.printStackTrace();
        return false;
    }
    }

    public List<PlaylistEntity> getAllPlaylists() {
        return playlistRepository.findAll();
    }

}


package com.badhu.controller;

import com.badhu.dto.LoginDTO;
import com.badhu.dto.PlaylistDTO;
import com.badhu.dto.SignupDTO;
import com.badhu.entity.ContentEntity;
import com.badhu.entity.PlaylistEntity;
import com.badhu.service.ContentService;
import com.badhu.service.PlaylistService;
import com.badhu.service.SignupService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class DataController {

    private final SignupService signupService;
    private final PlaylistService playlistService;
    private final ContentService contentService;

    public DataController(SignupService signupService, PlaylistService playlistService, ContentService contentService) {
        this.signupService = signupService;
        this.playlistService = playlistService;
        this.contentService = contentService;
    }

    @PostMapping("/signup_saving")
    public String signup_saving(@RequestBody SignupDTO dto){
        System.out.println("username: "+ dto);
        signupService.signupSaving(dto);
        return null;
    }

    @PostMapping("/login_checking")
    public boolean login_checking(@RequestBody LoginDTO dto){
        System.out.println("username: "+ dto.getEmail());
        return signupService.loginchecking(dto);
    }

    @PostMapping("/sendPlayList")
    public boolean creatingPlaylist(@RequestBody PlaylistDTO dto){
        System.out.println("name : "+ dto.getName());
        return playlistService.createPlaylist(dto);
    }

    @GetMapping("/getPlaylists")
    public List<PlaylistEntity> getPlaylists() {
        return playlistService.getAllPlaylists();
    }

    // UPDATED: Added playlistId parameter
    @PostMapping("/saveContent")
    public ContentEntity saveContent(
            @RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam("playlistId") Long playlistId,  // NEW
            @RequestParam(value = "source", required = false) String source,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws Exception {
        return contentService.saveContent(title, type, source, file, playlistId);
    }

    @GetMapping("/getAllContent")
    public List<ContentEntity> getAllContent() {
        return contentService.getAllContent();
    }

    @GetMapping("/getContents/{playlistId}")
    public List<ContentEntity> getContentsByPlaylist(@PathVariable Long playlistId) {
        return contentService.getContentsByPlaylistId(playlistId);
    }
}

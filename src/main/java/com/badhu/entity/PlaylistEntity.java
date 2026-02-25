package com.badhu.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "playlist")
public class PlaylistEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ElementCollection
    @CollectionTable(
            name = "playlist_subs",
            joinColumns = @JoinColumn(name = "playlist_id")
    )
    @Column(name = "sub_name")
    private List<String> subs;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<String> getSubs() { return subs; }
    public void setSubs(List<String> subs) { this.subs = subs; }
}

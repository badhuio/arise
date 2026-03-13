package com.badhu.dto;

import java.util.List;

public class PlaylistDTO {

    private Long id;
    private String name;
    private List<String> subs;

    public Long getId() {return  id;}
    public void setId(Long id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) { this.name = name; }

    public List<String> getSubs() {return subs; }
    public void setSubs(List<String> subs) { this.subs = subs; }


}

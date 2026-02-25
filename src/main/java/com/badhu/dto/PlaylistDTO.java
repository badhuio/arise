package com.badhu.dto;

import java.util.List;

public class PlaylistDTO {

    private String name;
    private List<String> subs;

    public String getName() {return name;}
    public void setName(String name) { this.name = name; }

    public List<String> getSubs() {return subs; }
    public void setSubs(List<String> subs) { this.subs = subs; }


}

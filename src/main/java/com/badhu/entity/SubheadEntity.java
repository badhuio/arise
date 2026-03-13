package com.badhu.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "subhead")
public class SubheadEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    private List<String> subs;

    public Long getId() {
        return id;
    }

    public List<String> getSubs() {
        return subs;
    }

    public void setSubs(List<String> subs) {
        this.subs = subs;
    }
}
package com.badhu.service;

import com.badhu.dao.SubheadRepository;
import org.springframework.stereotype.Service;

@Service
public class SubheadService {

    private final SubheadRepository subheadRepository;

    public SubheadService(SubheadRepository subheadRepository) {
        this.subheadRepository = subheadRepository;
    }

    public Boolean deleteSubItems(Long id) {

        try {
            subheadRepository.deleteById(id);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
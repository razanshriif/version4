package com.example.demo.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Tranck;
import com.example.demo.Repository.TranckRepository;
import com.example.demo.securityjwt.user.User;

@Service
public class TranckService {

    @Autowired
    private TranckRepository tranckRepository;

    public List<Tranck> findAll(User owner) {
        return tranckRepository.findByOwnerOrderByIdDesc(owner);
    }

    public Optional<Tranck> findById(Long id, User owner) {
        return tranckRepository.findByIdAndOwner(id, owner);
    }

    public Tranck save(Tranck tranck, User owner) {
        tranck.setOwner(owner);
        return tranckRepository.save(tranck);
    }

    public void deleteById(Long id, User owner) {
        Optional<Tranck> opt = tranckRepository.findByIdAndOwner(id, owner);
        if (opt.isPresent()) {
            tranckRepository.delete(opt.get());
        }
    }

    public Tranck updateTranck(Long id, Tranck tranckDetails, User owner) {
        Optional<Tranck> optionalTranck = tranckRepository.findByIdAndOwner(id, owner);
        if (optionalTranck.isPresent()) {
            Tranck tranck = optionalTranck.get();
            tranck.setDepartureDateTime(tranckDetails.getDepartureDateTime());

            tranck.setDepart(tranckDetails.getDepart());
            tranck.setChargement(tranckDetails.getChargement());
            tranck.setLivraison(tranckDetails.getLivraison());

            return tranckRepository.save(tranck);
        } else {
            throw new RuntimeException("Tranck not found with id " + id + " for this owner");
        }
    }
}
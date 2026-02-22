package com.example.demo.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.Entity.Tranck;
import com.example.demo.securityjwt.user.User;

public interface TranckRepository extends JpaRepository<Tranck, Long> {
    List<Tranck> findByOwnerOrderByIdDesc(User owner);

    Optional<Tranck> findByIdAndOwner(Long id, User owner);
}

package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Events;

public interface EventsRepository extends JpaRepository<Events, Long> {
	List<Events> findAllByVoycle(String voycle);

	Long countByVoycle(String voycle);

	void deleteAllByVoycle(String voycle);

}

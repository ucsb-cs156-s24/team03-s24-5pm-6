package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.RecommendationRequest;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RecommendationRequestRepository extends CrudRepository<RecommendationRequest, Long> {}
  //Iterable<RecommendationRequest> findAllByEmaiIterable(String emailString); I assume this is what we change the former UCSBDate line to?? Or is this not necessary



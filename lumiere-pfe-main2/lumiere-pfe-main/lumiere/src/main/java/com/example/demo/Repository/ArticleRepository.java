package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
	Article findByCodeArticle(String codeArticle);

}
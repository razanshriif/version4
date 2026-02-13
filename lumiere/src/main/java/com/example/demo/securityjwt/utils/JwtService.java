package com.example.demo.securityjwt.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service  // ← ADDED: Make it a Spring bean
public class JwtService {

    private static final String SECRET_KEY = "635266556A576E5A7234753778214125442A472D4B6150645367566B59703273";

    // ← REMOVED: Private constructor (Spring needs to instantiate this)

    public String extractUsername(String token) {  // ← REMOVED static
        return extractClaim(token, Claims::getSubject);
    }

    public String generateToken(  // ← REMOVED static
            Map<String, Object> extractClaim,
            UserDetails userDetails
    ) {
        return Jwts
                .builder()
                .setClaims(extractClaim)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
               // .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateToken(UserDetails userDetails) {  // ← REMOVED static
        return generateToken(new HashMap<>(), userDetails);
    }

    public boolean isTokenValid(  // ← REMOVED static
            String token,
            UserDetails userDetails
    ) {
        final var username = extractUsername(token);
       // return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
        return username.equals(userDetails.getUsername());
    }

    /*
    private boolean isTokenExpired(String token) {  // ← Would remove static here too
        return extractExpiration(token).before(new Date());
    }
 
    private Date extractExpiration(String token) {  // ← Would remove static here too
        return extractClaim(token, Claims::getExpiration);
    }
    */
    
    

    private Claims extractClaims(String token) {  // ← REMOVED static
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {  // ← REMOVED static
        final var keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private <C> C extractClaim(  // ← REMOVED static
            String token,
            Function<Claims, C> claimsResolver
    ) {
        final var claims = extractClaims(token);
        return claimsResolver.apply(claims);
    }

}
package com.example.demo.controller;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.Member;
import com.example.demo.service.MemberService;

@RestController
@RequestMapping("/api")
public class ApiController {
    
    @Autowired
    private MemberService memberService;
    
    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {
        try {
            List<Member> members = memberService.findMembers();
            return members.stream()
                    .map(member -> {
                        Map<String, Object> userMap = new HashMap<>();
                        userMap.put("id", member.getId());
                        userMap.put("name", member.getName());
                        userMap.put("email", member.getName() + "@example.com");
                        return userMap;
                    })
                    .toList();
        } catch (Exception e) {
            // 데이터가 없을 경우 샘플 데이터 반환
            return Arrays.asList(
                Map.of("id", 1L, "name", "사용자1", "email", "user1@example.com"),
                Map.of("id", 2L, "name", "사용자2", "email", "user2@example.com")
            );
        }
    }
    
    @GetMapping("/members")
    public List<Map<String, Object>> getMembers() {
        try {
            List<Member> members = memberService.findMembers();
            return members.stream()
                    .map(member -> {
                        Map<String, Object> memberMap = new HashMap<>();
                        memberMap.put("id", member.getId());
                        memberMap.put("name", member.getName());
                        return memberMap;
                    })
                    .toList();
        } catch (Exception e) {
            return Arrays.asList();
        }
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "API is working");
        return status;
    }
}

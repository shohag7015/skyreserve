package com.air.service.impl;

import com.air.entity.Admin;
import com.air.entity.User;
import com.air.repository.AdminRepository;
import com.air.repository.UserRepository;
import com.air.service.UserService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    public UserServiceImpl(UserRepository userRepository, AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public User signup(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(user);
    }

    @Override
    public User login(String email, String password) {
        // First check Admin table
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(password)) {
            Admin admin = adminOpt.get();
            User adminDto = new User();
            adminDto.setId(admin.getId());
            adminDto.setName(admin.getName());
            adminDto.setEmail(admin.getEmail());
            adminDto.setPassword(admin.getPassword());
            adminDto.setRole("ADMIN");
            return adminDto;
        }

        // Then check regular User table
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt.get();
        }
        throw new RuntimeException("Invalid email or password");
    }

    @Override
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}

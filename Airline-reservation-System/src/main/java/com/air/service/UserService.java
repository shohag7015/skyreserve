package com.air.service;

import com.air.entity.User;

public interface UserService {
    User signup(User user);

    User login(String email, String password);

    java.util.List<User> getAllUsers();

    void deleteUser(Long id);
}

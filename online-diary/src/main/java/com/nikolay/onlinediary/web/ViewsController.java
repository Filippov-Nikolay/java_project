package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.service.impl.JdbcHealthDao;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Simple MVC controller serving JSP pages and health check info.
 */
@Controller
public class ViewsController {

    private final JdbcHealthDao jdbcHealthDao;

    public ViewsController(JdbcHealthDao jdbcHealthDao) {
        this.jdbcHealthDao = jdbcHealthDao;
    }

    @GetMapping("/")
    public String index() {
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/main")
    public String main() {
        return "main";
    }

    @GetMapping("/subjects")
    public String subjects(Model model) {
        boolean dbOk;
        try {
            dbOk = jdbcHealthDao.isAlive();
        } catch (Exception e) {
            dbOk = false;
            model.addAttribute("dbError", e.getMessage());
        }
        model.addAttribute("dbOk", dbOk);
        return "subjects";
    }
}

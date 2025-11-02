package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.service.impl.JdbcHealthDao;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewsController {

    private final JdbcHealthDao jdbcHealthDao;

    public ViewsController(JdbcHealthDao jdbcHealthDao) {
        this.jdbcHealthDao = jdbcHealthDao;
    }

    @GetMapping("/")
    public String index() {
        return "redirect:/contacts";
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

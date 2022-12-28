package com.kob.backend.controller.user.account;

import com.kob.backend.service.user.account.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class LoginController {
    @Autowired
    private LoginService loginService;

    @PostMapping("/user/account/token/")
    public Map<String, String> getToken(@RequestParam Map<String, String> map) {
        //从map中获取到用户名和密码，然后调用loginService查看是否能够成功获取到token等
        //成功则将token拿到并且返回
        String username = map.get("username");
        String password = map.get("password");
        System.out.println(username + ' ' + password);
        return loginService.getToken(username, password);
    }
}

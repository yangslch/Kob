package com.kob.backend.service.impl.user.account;

import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.utils.UserDetailsImpl;
import com.kob.backend.service.user.account.LoginService;
import com.kob.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private AuthenticationManager authenticationManager;
    //通过该api验证是否可以进行登录操作

    @Override
    public Map<String, String> getToken(String username, String password) {
        //通过该api将username和password封装成类，其密码变成密文，将不再是明文
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(username, password);

        //验证是否可以进行正常登录，如果登录失败，会自动进行处理
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);  // 登录失败，会自动处理

        //登录成功，取出user
        UserDetailsImpl loginUser = (UserDetailsImpl) authenticate.getPrincipal();
        User user = loginUser.getUser();

        //将user id封装成一个jwt-token
        String jwt = JwtUtil.createJWT(user.getId().toString());

        //将结果进行存储并且返回
        Map<String, String> map = new HashMap<>();
        map.put("error_message", "success");
        map.put("token", jwt);

        return map;
    }
}

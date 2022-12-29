package com.kob.backend.service.user.bot;

import com.kob.backend.pojo.Bot;

import java.util.List;

//得到用户自己得所有bot列表
public interface GetListService {
    List<Bot> getList();
}

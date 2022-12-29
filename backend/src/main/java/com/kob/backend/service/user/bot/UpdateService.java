package com.kob.backend.service.user.bot;

import java.util.Map;

//更新一个bot
public interface UpdateService {
    Map<String, String> update(Map<String, String> data);
}

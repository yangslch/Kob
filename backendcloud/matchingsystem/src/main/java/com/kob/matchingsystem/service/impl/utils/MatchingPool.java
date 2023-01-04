package com.kob.matchingsystem.service.impl.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

@Component
public class MatchingPool extends Thread {
    //将所有用户都存储下来
    private static List<Player> players = new ArrayList<>();
    private final ReentrantLock lock = new ReentrantLock();
    private static RestTemplate restTemplate;
    private final static String startGameUrl = "http://127.0.0.1:3000/pk/start/game/";

    @Autowired
    public void setRestTemplate(RestTemplate restTemplate) {
        MatchingPool.restTemplate = restTemplate;
    }

    //添加一名玩家
    public void addPlayer(Integer userId, Integer rating) {
        //由于players被多个线程读取写入，故存在读写冲突问题，需要加锁保证安全性
        lock.lock();
        try {
            players.add(new Player(userId, rating, 0));
        } finally {
            lock.unlock();
        }
    }

    //删除一名玩家
    public void removePlayer(Integer userId) {
        lock.lock();
        try {
            List<Player> newPlayers = new ArrayList<>();
            //判断是否相等，相等则删除，不相等放到新的数组当中，最后将新数组赋给player变量
            for (Player player: players) {
                if (!player.getUserId().equals(userId)) {
                    newPlayers.add(player);
                }
            }
            players = newPlayers;
        } finally {
            lock.unlock();
        }
    }

    private void increaseWaitingTime() {  // 将所有当前玩家的等待时间加1
        for (Player player: players) {
            player.setWaitingTime(player.getWaitingTime() + 1);
        }
    }

    private boolean checkMatched(Player a, Player b) {  // 判断两名玩家是否匹配
        //匹配原则是a，b都能接受此分差
        int ratingDelta = Math.abs(a.getRating() - b.getRating());
        int waitingTime = Math.min(a.getWaitingTime(), b.getWaitingTime());
        return ratingDelta <= waitingTime * 10;
    }

    private void sendResult(Player a, Player b) {  // 返回匹配结果
        System.out.println("send result: " + a + " " + b);
        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("a_id", a.getUserId().toString());
        data.add("b_id", b.getUserId().toString());
        restTemplate.postForObject(startGameUrl, data, String.class);
    }

    private void matchPlayers() {  // 尝试匹配所有玩家
        System.out.println("match players: " + players.toString());
        //哪些玩家已经被匹配，即被匹配的玩家设置为true
        boolean[] used = new boolean[players.size()];
        //为了保证玩家体验，等待越久的玩家先进行匹配
        for (int i = 0; i < players.size(); i ++ ) {
            if (used[i]) continue;//已经被匹配即跳过，直到找到一个i未曾使用
            for (int j = i + 1; j < players.size(); j ++ ) {
                if (used[j]) continue;//同理找到j
                Player a = players.get(i), b = players.get(j);
                if (checkMatched(a, b)) {//判断i，j是否可以匹配
                    used[i] = used[j] = true;
                    sendResult(a, b);
                    break;
                }
            }
        }
        //将使用过的玩家从数组当中移除
        List<Player> newPlayers = new ArrayList<>();
        for (int i = 0; i < players.size(); i ++ ) {
            if (!used[i]) {
                newPlayers.add(players.get(i));
            }
        }
        players = newPlayers;
    }

    //匹配池开启
    @Override
    public void run() {
        //写一个死循环使得匹配池一直存在，每休眠一秒，匹配范围变大，再次匹配
        while (true) {
            try {
                Thread.sleep(1000);
                lock.lock();
                try {
                    increaseWaitingTime();
                    matchPlayers();
                } finally {
                    lock.unlock();
                }

            } catch (InterruptedException e) {
                e.printStackTrace();
                break;
            }
        }
    }
}

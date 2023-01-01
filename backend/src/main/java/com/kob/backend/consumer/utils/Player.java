package com.kob.backend.consumer.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

//确定两个玩家的位置，A在左上角，B在右下角，完全确定每个玩家对应的蛇是哪一条
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Player {
    //玩家的id，以及起始坐标
    private Integer id;
    private Integer sx;
    private Integer sy;
    //记录每名玩家走过的路径，即历史上执行过的方向的序列
    private List<Integer> steps;

    private boolean check_tail_increasing(int step) {  // 检验当前回合，蛇的长度是否增加
        if (step <= 10) return true;
        return step % 3 == 1;
    }

    //返回蛇的身体
    public List<Cell> getCells() {
        List<Cell> res = new ArrayList<>();

        int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1};
        int x = sx, y = sy;
        int step = 0;
        res.add(new Cell(x, y));
        for (int d: steps) {
            x += dx[d];
            y += dy[d];
            res.add(new Cell(x, y));
            //判断蛇尾是否增加，如果蛇尾不增加，将蛇尾删掉
            if (!check_tail_increasing( ++ step)) {
                res.remove(0);
            }
        }
        return res;
    }

    //将steps转成string，方便将其存入到数据库中
    public String getStepsString() {
        StringBuilder res = new StringBuilder();
        for (int d: steps) {
            res.append(d);
        }
        return res.toString();
    }
}

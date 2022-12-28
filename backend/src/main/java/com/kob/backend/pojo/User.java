package com.kob.backend.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
注解：data 自动生成get、set、toString等方法
No ALL 自动生成无参构造函数和全参构造函数
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    //mybatis自带的注解，标记主键自增
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String username;
    private String password;
    private String photo;
}

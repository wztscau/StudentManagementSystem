CREATE TABLE `user` (
  `uid` char(10) NOT NULL COMMENT '用户id=年份（4位）+部门（2位）+批次（2位）+序号（2位）',
  `pwd` varchar(50) NOT NULL COMMENT '密码',
  `role` enum('超级管理员','管理员','教师','学生','访客') NOT NULL DEFAULT '访客' COMMENT '用户角色',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态，true可用、false禁用',
  `reg_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `reg_id` char(10) NOT NULL COMMENT '录入注册信息的人，即管理员id',
  `login_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '用户登录时间',
  `login_count` smallint(6) NOT NULL DEFAULT '0' COMMENT '登录次数',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

CREATE TABLE `permission` (
  `pid` tinyint(4) NOT NULL AUTO_INCREMENT COMMENT '序号',
  `perm_role` enum('超级管理员','管理员','教师','学生','访客') NOT NULL COMMENT '权限使用角色',
  `perm_names` varchar(1000) NOT NULL COMMENT '权限名称，用&连接，子权限用.表示',
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8

CREATE TABLE `department` (
  `did` tinyint(4) NOT NULL,
  `d_name` enum('UI','Java','前端','未知') NOT NULL DEFAULT '未知',
  `batch` tinyint(4) NOT NULL DEFAULT '0',
  `people_count` smallint(6) NOT NULL DEFAULT '0',
  `reg_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8

CREATE TABLE `baseinfo` (
  `uid` char(10) NOT NULL COMMENT '用户id',
  `_id` char(18) NOT NULL COMMENT '身份证',
  `realname` varchar(10) NOT NULL COMMENT '真实姓名',
  `sex` enum('男','女') NOT NULL COMMENT '性别，‘男’、‘女’',
  `age` varchar(3) NOT NULL DEFAULT '未知' COMMENT '年龄',
  `school` varchar(255) NOT NULL DEFAULT '未知' COMMENT '毕业学校',
  `birthplace` varchar(50) NOT NULL DEFAULT '未知' COMMENT '籍贯',
  `party` enum('中共党员','中共预备党员','共青团员','无党派人士','群众','未知') NOT NULL DEFAULT '未知' COMMENT '政治面貌',
  `department` enum('前端','Java','UI','未知') NOT NULL DEFAULT '未知' COMMENT '部门',
  `phone` char(11) NOT NULL DEFAULT '未知' COMMENT '手机号码',
  `qq` varchar(15) NOT NULL DEFAULT '未知' COMMENT 'QQ号码',
  `email` varchar(50) NOT NULL DEFAULT '未知' COMMENT '电子邮箱',
  `head` longtext COMMENT '头像base64',
  PRIMARY KEY (`_id`),
  KEY `uid` (`uid`),
  CONSTRAINT `uid` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

CREATE TABLE `article` (
  `aid` smallint(5) NOT NULL AUTO_INCREMENT COMMENT '文章id',
  `article_title` varchar(128) NOT NULL COMMENT '文章名称',
  `article_content` text NOT NULL COMMENT '文章内容',
  `article_summary` varchar(120) NOT NULL DEFAULT '' COMMENT '文章摘要',
  `publish_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `click` int(10) NOT NULL DEFAULT '0' COMMENT '查看人数',
  `sort_name` varchar(10) NOT NULL DEFAULT 'unknown' COMMENT '所属分类名称',
  `user_id` char(10) NOT NULL COMMENT '所属用户id',
  `up` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否置顶',
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8
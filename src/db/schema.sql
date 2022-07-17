CREATE DATABASE oneday default CHARACTER SET UTF8;

-- 회원정보
create table `user`
(
    `id`           int          not null auto_increment primary key, -- 유저 index
    `email`        varchar(50),                                      -- 유저 email
    `password`     varchar(64),                                      -- 유저 password
    `type`         varchar(20)  not null,
    `role`         tinyint      not null default 0,                  -- 유저 등급 ( 0: 일반, 1: 관리자 )
    `user_token`   varchar(200),                                     -- 유저 인증 토큰
    `social_token` varchar(200),                                     -- 유저 소셜 토큰
    `name`         varchar(100) not null,                            -- 유저 이름(닉네임)
    `disabled`     tinyint      not null default 0,                  -- 활성화 여부 , 회원탈퇴 ( 0: 정상, 1: 탈퇴 )
    `create_date`  timestamp    not null default current_timestamp   -- 유저 생성일
);

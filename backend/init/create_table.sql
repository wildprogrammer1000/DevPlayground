create table if not exists users (
	id int primary key auto_increment,
	platform varchar(20) not null,
	role varchar(10) not null default "user",
	email varchar(50) not null,
	nickname varchar(20) unique,
	create_time timestamp default current_timestamp()
);

create table if not exists waiting_users (
	id int primary key auto_increment,
	platform varchar(20) not null,
	role varchar(10) not null default "user",
	email varchar(50) not null,
	nickname varchar(20) unique
);

create table if not exists board (
	id int primary key auto_increment,
	user_id int not null,
	title varchar(100) not null,
	content text not null,
	category varchar(20) not null,
	create_time timestamp not null default current_timestamp(),
	update_time timestamp not null default current_timestamp() on update current_timestamp()
);

create table if not exists comment (
	id int primary key auto_increment,
	user_id int not null,
	post_id int not null,
	content text not null,
	create_time timestamp not null default current_timestamp(),
	update_time timestamp not null default current_timestamp(),
	foreign key (user_id) references users (id) on delete cascade,
	foreign key (post_id) references board (id) on delete cascade
);

create table if not exists likes (
	id int primary key auto_increment,
	post_id int not null,
	user_id int not null
);

create table if not exists sys_log (
	id int primary key auto_increment,
	user_id int not null,
	role varchar(10) not null,
	content text not null,
	action varchar(30) not null,
	foreign key (user_id) references users(id)
);

create table if not exists friends (
	user1_id int not null,
	user2_id int not null,
	state int default 0,
	create_time timestamp default current_timestamp(),
	foreign key (user1_id) references users(id) on delete cascade,
	foreign key (user2_id) references users(id) on delete cascade
);

create table if not exists notifications (
	id int primary key auto_increment,
	type int not null,
	sender_id int not null,
	receiver_id int not null,
	content text not null,
	create_time timestamp default current_timestamp()
);

create table if not exists messages (
	id int primary key auto_increment,
	sender_id int not null,
	receiver_id int not null,
	content text not null,
	create_time timestamp default current_timestamp(),
	key sender_id (sender_id),
	key receiver_id (receiver_id),
	foreign key (sender_id) references users(id),
	foreign key (receiver_id) references users(id)
);
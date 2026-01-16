create database B_Day_Connect;

use B_day_connect;


create table roles(
	id_rol int auto_increment primary key,
    nombre_rol varchar(50) not null
);

insert into roles
(nombre_rol) values ('admin'), ('usuario');

select * from roles;

create table usuarios(
	id_usuario int auto_increment primary key,
	nombre varchar(100) not null,
    email varchar(100) unique not null,
    password varchar(255) not null,
    fecha_nacimiento date not null,
    fecha_registro  datetime default CURRENT_TIMESTAMP,
    id_rol int not null,
    estado varchar(20) not null default 'activo',
    reset_required tinyint(1) not null default 0,
    foreign key (id_rol)references roles(id_rol)
);

insert into usuarios (nombre, email, password, id_rol, fecha_nacimiento)
values(
'Juan Cayetano',
'adminprincipal@tfg.com',
'admin123456',
1,
'1989-12-31'
);

select u.nombre, r.nombre_rol as Permiso from usuarios u
join roles r on u.id_rol = r.id_rol
where r.nombre_rol = 'admin';


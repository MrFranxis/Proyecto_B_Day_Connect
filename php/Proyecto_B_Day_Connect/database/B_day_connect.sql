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

use b_day_connect;

select*from usuarios;


create table categorias (
id_categoria int auto_increment primary key,
nombre_categoria varchar (100) not null
);

insert into categorias (nombre_categoria)
values ('familia'), ('amigos'), ('pareja'), ('trabajo'), ('conocidos');

select*from categorias;

create table gustos(
id_gustos int auto_increment primary key,
nombre_gusto varchar (100) not null
);

insert into gustos (nombre_gusto)
values ('cine'),('videojuegos'),('arte'),('lectura'),('musica'),('viajar');


create table contactos(
id_contacto int auto_increment primary key,
id_usuario int not null,
nombre varchar(100),
email varchar(100),
telefono varchar(20),
fecha_nacimiento date,
fecha_registro datetime default current_timestamp,
foreign key (id_usuario) references usuarios(id_usuario)
);

create table contacto_categoria(
id_contacto  int not null,
id_categoria  int not null,
primary key (id_contacto, id_categoria),
foreign key (id_contacto) references contactos(id_contacto),
foreign key (id_categoria) references categorias(id_categoria)
);


create table contacto_gustos(
id_contacto int not null,
id_gustos int not null,
primary key (id_contacto, id_gustos),
foreign key (id_contacto) references contactos(id_contacto),
foreign key (id_gustos) references gustos(id_gustos)
);


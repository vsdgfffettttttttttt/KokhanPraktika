create table _address
(
    id         bigint  not null auto_increment,
    building   integer not null,
    city       varchar(255),
    country    varchar(255),
    street     varchar(255),
    cliente_id bigint,
    primary key (id)
) engine = InnoDB;
create table _attribute
(
    id              bigint    not null auto_increment,
    name            varchar(255),
    value_attribute float(53) not null,
    primary key (id)
) engine = InnoDB;
create table _order
(
    id           bigint not null auto_increment,
    data_created datetime(6),
    status_order bit    not null,
    clientes_id  bigint,
    primary key (id)
) engine = InnoDB;
create table attribute_has_product
(
    id           bigint not null auto_increment,
    attribute_id bigint,
    productes_id bigint,
    primary key (id)
) engine = InnoDB;
create table category
(
    id          bigint not null auto_increment,
    description varchar(255),
    image       varchar(255),
    name        varchar(255),
    primary key (id)
) engine = InnoDB;
create table clients
(
    id         bigint  not null,
    age        integer not null,
    email      varchar(255),
    first_name varchar(255),
    last_name  varchar(255),
    phone      integer not null,
    primary key (id)
) engine = InnoDB;
create table product_has_order
(
    id         bigint  not null auto_increment,
    quantity   integer not null,
    order_id   bigint,
    product_id bigint,
    primary key (id)
) engine = InnoDB;
create table products
(
    id          bigint not null auto_increment,
    description varchar(255),
    image       varchar(255),
    name        varchar(255),
    price       decimal(38, 2),
    category_id bigint,
    primary key (id)
) engine = InnoDB;
create table roles
(
    id   bigint not null auto_increment,
    name varchar(255),
    primary key (id)
) engine = InnoDB;
create table users
(
    id       bigint not null auto_increment,
    password varchar(255),
    username varchar(255),
    primary key (id)
) engine = InnoDB;
create table users_rolesset
(
    users_id    bigint not null,
    rolesset_id bigint not null,
    primary key (users_id, rolesset_id)
) engine = InnoDB;
alter table _address
    add constraint FKnix5grh7trnvtthicrqi2jt7e foreign key (cliente_id) references clients (id);
alter table _order
    add constraint FK4yqyt6fa0505yj76e5yi7jo43 foreign key (clientes_id) references clients (id);
alter table attribute_has_product
    add constraint FK3elo3koep9w9jwt7bi3vbcgi7 foreign key (attribute_id) references _attribute (id);
alter table attribute_has_product
    add constraint FK2ipqcy2bop4unhxk7f7y1aksy foreign key (productes_id) references products (id);
alter table clients
    add constraint FK1hgwdp9vl25xl9i7s354sifey foreign key (id) references users (id);
alter table product_has_order
    add constraint FK4sx8safku3mpls0cdw7ng5br8 foreign key (order_id) references _order (id);
alter table product_has_order
    add constraint FKfgp6lkbm40x2ofocigdkfm1io foreign key (product_id) references products (id);
alter table products
    add constraint FK1cf90etcu98x1e6n9aks3tel3 foreign key (category_id) references category (id);
alter table users_rolesset
    add constraint FKbae8tw2kg6p1ja9cges83x7ha foreign key (rolesset_id) references roles (id);
alter table users_rolesset
    add constraint FKt7213is417582bjg6e95g5w53 foreign key (users_id) references users (id);
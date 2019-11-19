create table allTowns(
	id serial not null primary key,
	towns text not null
);

create table regNumbers (
	id serial not null primary key,
    registration text not null,
	allTowns_id int,
	foreign key (allTowns_id) references allTowns(id)
);

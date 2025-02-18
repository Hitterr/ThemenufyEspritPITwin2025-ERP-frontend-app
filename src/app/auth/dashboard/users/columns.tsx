"use client";
import { ColumnDef } from "@tanstack/react-table";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
	id: string;
	name: string;
	email: string;
};
export const usersData: User[] = [
	{
		id: "728ed52f",
		name: "shadcn",
		email: "m@example.com",
	},
	{
		id: "489e1d42",
		name: "shadcn",
		email: "example@gmail.com",
	},
	// ...
];
export const usersColumns: ColumnDef<User>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
];

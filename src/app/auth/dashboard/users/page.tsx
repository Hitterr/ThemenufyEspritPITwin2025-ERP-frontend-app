import { useUsers } from "@/app/api/users/useUsers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { DataTable } from "./data-table";
import { usersColumns } from "./columns";
import { Spinner } from "flowbite-react";
export default function UsersPage() {
	const { data, isLoading, isError } = useUsers();
	console.log("📢 [page.tsx:9]", data);
	return (
		<div className="w-full h-full">
			<h1 className="text-3xl font-light">Users</h1>
			<div className="bg-muted/50 p-4 flex flex-col gap-4 justify-start items-center min-h-full flex-1 rounded-xl ">
				{isLoading ? <Spinner size="md" className="text-primary" /> : ""}
				{isError ? (
					<Alert variant="destructive">
						<Terminal className="h-4 w-4" />
						<AlertTitle>Heads up!</AlertTitle>
						<AlertDescription>
							There was a problem with your request.
						</AlertDescription>
					</Alert>
				) : (
					""
				)}
				{data ? <DataTable data={data} columns={usersColumns} /> : ""}
			</div>
		</div>
	);
}

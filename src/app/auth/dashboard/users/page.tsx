import { useUsers } from "@/app/api/users/useUsers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { DataTable } from "./data-table";
import { usersColumns } from "./columns";
import { Button } from "@/components/ui/button";
export default function UsersPage() {
	const { data, isLoading, isError } = useUsers();
	return (
		<div className="w-full h-full">
			<div className="bg-muted/50 p-4 flex flex-col gap-4 justify-center items-center min-h-[100vh] flex-1 rounded-xl md:min-h-min">
				<h1 className="text-3xl font-light">Users</h1>
				{isLoading ? (
					<Button className="bg-primary text-primary-foreground ..." disabled>
						<svg className="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24"></svg>
						Processing…
					</Button>
				) : (
					""
				)}
				{isError ? (
					<Alert>
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

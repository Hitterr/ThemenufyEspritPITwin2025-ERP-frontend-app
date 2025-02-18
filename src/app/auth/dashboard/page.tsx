import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, Outlet, useLocation } from "react-router";
export default function DashboardPage() {
	const location = useLocation();
	const pathnames = location.pathname
		.split("/")
		.filter((x) => x)
		.map((x, index, arr) => {
			if (index > 0) return { url: arr[index - 1] + "/" + x, name: x };
			return { url: "/" + arr[index], name: x };
		});
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center justify-between px-5 md:px-20 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList className="flex items-center">
								{pathnames.map(
									(value: { url: string; name: string }, index: number) => {
										if (index === pathnames.length - 1)
											return (
												<>
													<BreadcrumbItem
														className="hidden md:block capitalize font-bold text-primary"
														key={"BreadcrumbItem" + index}
													>
														<Link to={""}>{value.name}</Link>
													</BreadcrumbItem>
												</>
											);
										else
											return (
												<>
													<BreadcrumbItem
														className="hidden md:block capitalize"
														key={"BreadcrumbItem" + index}
													>
														<Link to={value.url}>{value.name}</Link>
													</BreadcrumbItem>
													<BreadcrumbSeparator
														className="hidden md:block"
														key={"BreadcrumbSeparator" + index}
													/>
												</>
											);
									},
									""
								)}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					<ModeToggle />
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="bg-muted/50 p-4 flex flex-col gap-4 justify-center items-center min-h-[100vh] flex-1 rounded-xl md:min-h-min">
						<Outlet />
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

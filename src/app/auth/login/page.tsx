import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { Link } from "react-router";
export default function LoginPage() {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<Link to="/" className="flex items-center gap-2 font-medium ">
						<div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<GalleryVerticalEnd className="size-5" />
						</div>
						Acme Inc.
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<LoginForm />
					</div>
				</div>
			</div>
			<div className="relative hidden bg-muted lg:block">
				<img
					src="https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg"
					alt="Image"
					className="absolute inset-0 h-full w-full object-cover  dark:brightness-[0.2] dark:grayscale "
				/>
			</div>
		</div>
	);
}

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogIn, LogOut, User } from "lucide-react";

export default function Navbar() {
    return (
        <footer className="bg-background shadow-lg">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <img src="/logo.png" alt="Logo" width={116} height={32} />
                <AuthMenu />
            </div>
        </footer>
    );
}

function AuthMenu() {
    const navigate = useNavigate();
    const { data } = auth.useSession();

    return data?.user ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-xs">
                    <User />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <div className="flex items-center gap-3 px-3 py-2">
                    <img src="https://i.pravatar.cc/40" alt="Rumi Aktar" width={40} height={40} className="rounded-full object-cover" />
                    <div className="min-w-0 space-y-2">
                        <p className="font-semibold leading-none">{data?.user?.name}</p>
                        <p className="text-sm text-muted-foreground leading-none">{data?.user?.email}</p>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    onClick={async () => {
                        await auth.signOut({
                            fetchOptions: {
                                onSuccess: () => {
                                    navigate({ to: "/signin" });
                                },
                            },
                        });
                    }}
                >
                    <LogOut />
                    <span>Signout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Button variant="outline" size="icon-xs" asChild>
            <Link to="/signin">
                <LogIn />
            </Link>
        </Button>
    );
}

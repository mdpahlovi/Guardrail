import { Mail, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-secondary text-white">
            <div className="container mx-auto p-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <p className="text-xl">Powered by</p>
                    <img src="/logo-white.png" alt="Logo" width={116} height={32} />
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <p>Helpline</p>
                    <p className="flex items-center gap-2">
                        <Phone size={16} /> +88 011020202505
                    </p>
                    <p className="flex items-center gap-2">
                        <Mail size={16} /> support@akij.work
                    </p>
                </div>
            </div>
        </footer>
    );
}

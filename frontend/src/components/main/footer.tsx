import { Mail, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-secondary text-white">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between ">
                <div className="flex items-center gap-2">
                    <p className="text-xl">Powered by</p>
                    <img src="/logo-white.png" alt="Logo" width={116} height={32} />
                </div>
                <div className="flex gap-4">
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

import { Button } from "@/components/ui/button";
import { Globe, Github, Mail, ExternalLink } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export default function ProjectInfo() {
    return (
    <div className="mt-16 border-t pt-12">
        <h2 className="text-2xl font-bold mb-6 justify-center flex">More</h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">About the Accounts</h3>
                <p className="text-muted-foreground mb-4">
                    This will log into all of my projects. You can create an account using email and password, or use third-party providers like Google, GitHub.
                </p>
                <div className="flex justify-center mt-4">
                    <Button asChild variant="outline">
                        <a
                            href="https://github.com/anktw/accounts"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                        >
                            <Github size={18} />
                            Source Code
                        </a>
                    </Button>
                </div>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">More Info and Settings</h3>
                <ul className="space-y-3">
                    <li>
                        <a
                            href="https://unkit.site"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors"
                        >
                            <Globe size={18} className="text-primary" />
                            <span>My Portfolio</span>
                            <ExternalLink size={14} className="ml-auto text-muted-foreground" />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://github.com/anktw"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors"
                        >
                            <Github size={18} className="text-primary" />
                            <span>GitHub Profile</span>
                            <ExternalLink size={14} className="ml-auto text-muted-foreground" />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://unkit.site/contact" target="_blank"
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors"
                        >
                            <Mail size={18} className="text-primary" />
                            <span>Contact me</span>
                            <ExternalLink size={14} className="ml-auto text-muted-foreground" />
                        </a>
                    </li>
                    <li>
                        <div className="flex items-center gap-2 p-2 rounded-md transition-colors">
                            <span>Toggle Theme</span>
                            <span className="ml-auto text-muted-foreground">
                                <ModeToggle />
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>)
}
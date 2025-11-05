import { GraduationCap, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold text-gradient">AI 4 Africa</span>
          </div>
          
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> for educational impact in Africa
          </p>
          
          <p className="text-sm text-muted-foreground">
            © 2025 AI 4 Africa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

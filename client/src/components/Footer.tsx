import React from "react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} Smart Parking System</div>
        <div className="flex items-center gap-4">
          <h4>+965 99494896</h4>
          <h4>ab-c@live.com </h4>    
        </div>
      </div>
    </footer>
  );
}

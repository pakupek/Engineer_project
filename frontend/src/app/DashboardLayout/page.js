"use client";

import styles from "./DashboardLayout.module.css";
import { Home, Settings, LogOut, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ onLogout, loading, user, children }) {
    const pathname = usePathname();

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Panel Użytkownika</h2>
        </div>

        <nav className={styles.sidebarNav}>
          <a href="/profile" className={`${styles.navLink} ${ pathname === "/profile" ? styles.active : "" }`}>
            <Home size={20} /> <span>Dashboard</span>
          </a>

          <a href="/EditProfile" className={`${styles.navLink} ${ pathname === "/EditProfile" ? styles.active : "" }`}>
            <Settings size={20} /> <span>Edytuj profil</span>
          </a>

          <a href="/carList" className={`${styles.navLink} ${ pathname === "/carList" ? styles.active : "" }`}>
            <Settings size={20} /> <span>Moje pojazdy</span>
          </a>
        </nav>

        <button
          onClick={onLogout}
          className={styles.logoutBtn}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Wylogowywanie...
            </>
          ) : (
            <>
              <LogOut size={20} /> Wyloguj się
            </>
          )}
        </button>
      </aside>
      <main>
            {children}
        </main>
    </div>
  );
}

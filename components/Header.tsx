"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IconMenu } from "./icons";

const NAV_LINKS = [
  { href: "/", label: "Início", active: true },
  { href: "/servicos", label: "Serviços", active: false },
  { href: "/campanha", label: "Campanha 2025/26", active: false },
  { href: "/contactos", label: "Contactos", active: false },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <Link href="/" className="nav-logo">
        <Image src="/images/logo.jpeg" alt="AGRO TRADES LDA" width={52} height={52} priority />
      </Link>

      <ul className={`nav-links${open ? " open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={link.active ? "active" : undefined}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className={`lang-switcher${open ? " open" : ""}`}>
        <button type="button" className="lang-btn active" aria-current="true">
          PT
        </button>
        <button type="button" className="lang-btn" disabled title="Disponível numa fase futura">
          EN
        </button>
      </div>

      <button
        type="button"
        className="nav-menu-btn"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{ display: open ? "flex" : undefined }}
      >
        <IconMenu width={22} height={22} />
      </button>
    </nav>
  );
}

import Image from "next/image";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="footer-logo">
            <Image src="/images/logo.jpeg" alt="AGRO TRADES LDA" width={48} height={48} />
          </div>
          <p className="footer-desc">
            Somos uma empresa moçambicana dedicada à produção agrícola.
          </p>
        </div>
        <div>
          <h4>Serviços</h4>
          <ul>
            <li><a href="/servicos">Produção de arroz</a></li>
            <li><a href="/servicos">Mecanização agrícola</a></li>
            <li><a href="/servicos">Processamento industrial</a></li>
            <li><a href="/campanha">Campanha 2025/2026</a></li>
          </ul>
        </div>
        <div>
          <h4>Links</h4>
          <ul>
            <li><a href="/">Início</a></li>
            <li><a href="/servicos">Serviços</a></li>
            <li><a href="/campanha">Campanha</a></li>
            <li><a href="/contactos">Contactos</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {year} AGRO TRADES, LDA. Todos os direitos reservados.</span>
        <span>Nampula, Moçambique</span>
      </div>
    </footer>
  );
}

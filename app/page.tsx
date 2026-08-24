import {
  IconArrowRight,
  IconBuilding,
  IconCorn,
  IconFactory,
  IconLeaf,
  IconMapPin,
  IconTractor,
  IconWhatsapp,
  IconWheat,
} from "@/components/icons";

const WHATSAPP_URL = "https://wa.me/258841031220";

const SERVICE_PREVIEW = [
  {
    id: "arroz",
    icon: IconWheat,
    title: "Produção de arroz",
    text: "Cultivo e produção de arroz de qualidade no Distrito de Moma, Província de Nampula.",
  },
  {
    id: "cereais",
    icon: IconCorn,
    title: "Cereais e legumes",
    text: "Produção diversificada de cereais e legumes para consumo local e comercialização.",
  },
  {
    id: "mecanizacao",
    icon: IconTractor,
    title: "Mecanização agrícola",
    text: "Serviços de mecanização e preparação de terras para agricultores e cooperativas.",
  },
  {
    id: "moageira",
    icon: IconFactory,
    title: "Processamento industrial",
    text: "Moageira e processamento industrial de cereais para o mercado moçambicano.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-pattern" />
        <div className="hero-content">
          <div className="hero-tag fade-up">Empresa Agrícola Moçambicana</div>
          <h1 className="fade-up-2">
            <span>Soberania começa</span>
            <br />
            <span style={{ color: "var(--orange)" }}>no prato.</span>
          </h1>
          <p className="hero-motto fade-up-2">
            &quot;Trabalhar a terra é criar riqueza para Moçambique&quot;
          </p>
          <p className="fade-up-3">
            Somos uma empresa moçambicana dedicada à produção agrícola, com foco no arroz,
            cereais, legumes, mecanização agrícola e processamento industrial.
          </p>
          <div className="hero-btns fade-up-3">
            <a href={WHATSAPP_URL} className="btn-primary" target="_blank" rel="noopener">
              <IconWhatsapp />
              <span>Fale connosco no WhatsApp</span>
            </a>
            <a href="/servicos" className="btn-secondary">
              <span>Ver serviços</span>
              <IconArrowRight width={16} height={16} />
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-num">2+</span>
          <span className="stat-label">Anos de actividade</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">&#8734;</span>
          <span className="stat-label">Hectares cultivados</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">8</span>
          <span className="stat-label">Serviços agrícolas</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">MZ</span>
          <span className="stat-label">Distrito de Moma</span>
        </div>
      </div>

      {/* ABOUT */}
      <section style={{ background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="about-grid">
            <div>
              <span className="section-tag">Sobre a empresa</span>
              <h2 className="section-title">Quem somos</h2>
              <p className="section-sub">
                A AGRO TRADES, LDA é uma empresa moçambicana dedicada ao desenvolvimento
                agrícola, com foco na produção de arroz, outros cereais e legumes, preparação
                de terras, mecanização agrícola, apoio técnico no campo, comercialização
                agrícola e processamento industrial.
              </p>
              <p
                style={{
                  fontSize: 16,
                  color: "var(--text-muted)",
                  lineHeight: 1.8,
                  marginTop: 16,
                }}
              >
                A empresa contribui para o fortalecimento da soberania alimentar em
                Moçambique, promovendo o trabalho no campo, a valorização da terra, a criação
                de emprego e o aumento da produção nacional.
              </p>
              <div className="about-tags">
                <span className="about-tag">
                  <IconWheat width={16} height={16} /> Produção de Arroz
                </span>
                <span className="about-tag">
                  <IconTractor width={16} height={16} /> Mecanização
                </span>
                <span className="about-tag">
                  <IconCorn width={16} height={16} /> Cereais
                </span>
                <span className="about-tag">
                  <IconFactory width={16} height={16} /> Processamento Industrial
                </span>
                <span className="about-tag">
                  <IconMapPin width={16} height={16} /> Nampula
                </span>
              </div>
            </div>
            <div className="about-visual">
              <div className="about-card">
                <blockquote>
                  &quot;Trabalhar a terra é criar riqueza para Moçambique&quot;
                </blockquote>
                <p className="quote-author">
                  — Presidente Daniel Chapo &nbsp;&middot;&nbsp; Campanha Agrícola 2025/2026
                </p>
              </div>
              <div
                style={{
                  marginTop: 20,
                  background: "var(--green-light)",
                  borderRadius: 16,
                  padding: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "var(--green)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  EC
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>Eng. Cipriano</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>CEO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <span className="section-tag">O que fazemos</span>
              <h2 className="section-title">Os nossos serviços</h2>
            </div>
            <a href="/servicos" className="btn-primary">
              Ver serviços
            </a>
          </div>
          <div className="services-grid">
            {SERVICE_PREVIEW.map(({ id, icon: Icon, title, text }) => (
              <div className="service-card" key={id}>
                <div className="service-icon">
                  <Icon width={24} height={24} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <a href={`/servicos/${id}`} className="btn-saiba-mais">
                  Saiba mais <IconArrowRight width={14} height={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAMPANHA BANNER */}
      <div className="campanha-banner">
        <div>
          <div className="hero-tag" style={{ marginBottom: 12 }}>
            Empresa Agrícola Moçambicana
          </div>
          <h2>Campanha Agrícola 2025/2026</h2>
          <p>
            Iniciámos as operações da nova campanha agrícola, alinhada com o incentivo do
            Presidente Daniel Chapo. A soberania alimentar começa com a valorização da terra.
          </p>
        </div>
        <a href="/campanha" className="btn-primary" style={{ background: "var(--orange)" }}>
          <span>Saber mais</span>
          <IconArrowRight width={16} height={16} />
        </a>
      </div>

      {/* LOCATIONS */}
      <section style={{ background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span className="section-tag">Localização</span>
          <h2 className="section-title">Onde estamos</h2>
          <div className="locations-grid">
            <div className="location-card">
              <div className="loc-icon">
                <IconBuilding width={28} height={28} />
              </div>
              <p className="loc-type">Escritório Sede</p>
              <h3>Cidade de Nampula</h3>
              <address>
                Rua de Tete, n.º 370, Limoeiros
                <br />
                Ao lado da Shoprite
                <br />
                Cidade de Nampula, Moçambique
              </address>
            </div>
            <div className="location-card">
              <div className="loc-icon">
                <IconLeaf width={28} height={28} />
              </div>
              <p className="loc-type">Machamba</p>
              <h3>Distrito de Moma</h3>
              <address>
                Posto Administrativo de Chalaua
                <br />
                Distrito de Moma
                <br />
                Província de Nampula, Moçambique
              </address>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

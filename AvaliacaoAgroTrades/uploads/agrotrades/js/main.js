// ── SERVICES DATA ──
const SERVICES = [
  {
    id: 'arroz', icon: '🌾',
    title: { pt: 'Produção de arroz', en: 'Rice Production' },
    summary: {
      pt: 'Cultivo e produção de arroz de qualidade no Distrito de Moma, com técnicas modernas e sustentáveis para maximizar a colheita e contribuir para a segurança alimentar.',
      en: 'Quality rice cultivation in the Moma District using modern sustainable techniques to maximise harvests and contribute to food security.'
    },
    description: {
      pt: 'A AGRO TRADES dedica-se ao cultivo intensivo de arroz no Distrito de Moma, Nampula, aproveitando as condições climáticas e hidrográficas favoráveis da região. Utilizamos variedades de alto rendimento combinadas com práticas agronómicas modernas, incluindo controlo rigoroso de água, fertilização adequada e gestão integrada de pragas. O nosso processo garante arroz de elevada qualidade, destinado tanto ao mercado local como ao abastecimento regional, contribuindo directamente para a soberania alimentar de Moçambique.',
      en: 'AGRO TRADES focuses on intensive rice cultivation in the Moma District, Nampula, leveraging the region\'s favourable climatic and hydrographic conditions. We use high-yield varieties combined with modern agronomic practices, including strict water management, proper fertilisation and integrated pest control. Our process ensures high-quality rice destined for both local and regional markets, directly contributing to Mozambique\'s food sovereignty.'
    },
    highlights: {
      pt: ['Variedades de alto rendimento adaptadas ao clima local', 'Gestão integrada de água e fertilização', 'Controlo de pragas com métodos sustentáveis', 'Colheita mecanizada para maior eficiência', 'Contribuição directa para a segurança alimentar nacional'],
      en: ['High-yield varieties adapted to local climate', 'Integrated water and fertilisation management', 'Sustainable pest control methods', 'Mechanised harvesting for greater efficiency', 'Direct contribution to national food security']
    }
  },
  {
    id: 'cereais', icon: '🌽',
    title: { pt: 'Produção de cereais e legumes', en: 'Cereals & Vegetables' },
    summary: {
      pt: 'Diversificação agrícola com produção de milho, feijão, amendoim e outros legumes e cereais essenciais para o consumo local e a comercialização.',
      en: 'Agricultural diversification with maize, beans, peanuts and other essential cereals and vegetables for local consumption and trade.'
    },
    description: {
      pt: 'Para além do arroz, a AGRO TRADES aposta numa produção diversificada que inclui milho, feijão, amendoim, gergelim e outros cultivos essenciais. Esta diversificação não só reduz os riscos associados à monocultura como assegura um abastecimento contínuo de alimentos básicos às comunidades locais. Trabalhamos com agricultores parceiros para expandir as áreas de cultivo e implementar rotação de culturas, melhorando a saúde do solo e a produtividade a longo prazo.',
      en: 'Beyond rice, AGRO TRADES invests in diversified production including maize, beans, peanuts, sesame and other essential crops. This diversification not only reduces monoculture risks but ensures a continuous supply of staple foods to local communities. We work with partner farmers to expand cultivation areas and implement crop rotation, improving soil health and long-term productivity.'
    },
    highlights: {
      pt: ['Milho, feijão, amendoim e gergelim', 'Rotação de culturas para saúde do solo', 'Parceria com agricultores locais', 'Sementes melhoradas de alto rendimento', 'Escoamento garantido para o mercado regional'],
      en: ['Maize, beans, peanuts and sesame', 'Crop rotation for soil health', 'Partnership with local farmers', 'Improved high-yield seeds', 'Guaranteed outlet to regional markets']
    }
  },
  {
    id: 'moageira', icon: '🏭',
    title: { pt: 'Moageira e processamento industrial', en: 'Milling & Industrial Processing' },
    summary: {
      pt: 'Processamento industrial de cereais através de moageira moderna, transformando a produção agrícola em produtos acabados para o mercado moçambicano.',
      en: 'Industrial cereal processing using modern milling equipment, transforming agricultural output into finished products for the Mozambican market.'
    },
    description: {
      pt: 'A nossa unidade de processamento industrial representa um elo fundamental na cadeia de valor agrícola. Equipada com moageira moderna, a AGRO TRADES transforma os cereais produzidos localmente em farinha e outros produtos acabados, prontos para consumo. Este serviço não apenas agrega valor à produção própria como está disponível para terceiros — agricultores, cooperativas e associações — que necessitem de processar a sua colheita de forma rápida e eficiente.',
      en: 'Our industrial processing unit represents a fundamental link in the agricultural value chain. Equipped with modern milling equipment, AGRO TRADES transforms locally produced cereals into flour and other finished products ready for consumption. This service is also available to third parties — farmers, cooperatives and associations — who need to process their harvest quickly and efficiently.'
    },
    highlights: {
      pt: ['Moageira moderna de alta capacidade', 'Processamento de arroz, milho e outros cereais', 'Serviço disponível para terceiros', 'Garantia de qualidade no produto final', 'Embalagem e preparação para comercialização'],
      en: ['High-capacity modern milling', 'Processing of rice, maize and other cereals', 'Service available to third parties', 'Quality assurance on final product', 'Packaging and preparation for trade']
    }
  },
  {
    id: 'terras', icon: '🌱',
    title: { pt: 'Preparação de terras', en: 'Land Preparation' },
    summary: {
      pt: 'Serviços completos de preparação e nivelamento de terrenos agrícolas, utilizando maquinaria especializada para optimizar as condições de cultivo.',
      en: 'Complete land preparation and levelling services using specialist machinery to optimise growing conditions.'
    },
    description: {
      pt: 'A preparação adequada do solo é a base de qualquer produção agrícola bem-sucedida. A AGRO TRADES oferece um serviço completo de preparação de terrenos que inclui limpeza, desbaste, lavoura, gradagem e nivelamento. Com equipamentos modernos e operadores experientes, preparamos solos para culturas anuais e perenes, garantindo que cada hectare esteja nas melhores condições para receber a sementeira e maximizar a produtividade.',
      en: 'Proper soil preparation is the foundation of any successful agricultural production. AGRO TRADES offers a complete land preparation service including clearing, tilling, ploughing, harrowing and levelling. With modern equipment and experienced operators, we prepare soils for annual and perennial crops, ensuring every hectare is in the best conditions to receive seed and maximise productivity.'
    },
    highlights: {
      pt: ['Limpeza e desbaste de terrenos', 'Lavoura profunda e gradagem', 'Nivelamento para irrigação eficiente', 'Operadores certificados e experientes', 'Serviço disponível para particulares e cooperativas'],
      en: ['Land clearing and tilling', 'Deep ploughing and harrowing', 'Levelling for efficient irrigation', 'Certified and experienced operators', 'Service available for individuals and cooperatives']
    }
  },
  {
    id: 'campanha', icon: '📅',
    title: { pt: 'Campanha agrícola 2025/2026', en: 'Agricultural Campaign 2025/2026' },
    summary: {
      pt: 'Participação activa na campanha agrícola nacional, alinhada com as directivas do Governo moçambicano para o aumento da produção alimentar.',
      en: 'Active participation in the national agricultural campaign, aligned with the Mozambican Government\'s directives to increase food production.'
    },
    description: {
      pt: 'A AGRO TRADES participa activamente na Campanha Agrícola 2025/2026, respondendo ao apelo do Governo moçambicano para o aumento significativo da produção alimentar. A nossa participação abrange o alargamento das áreas cultivadas, o aumento da produtividade por hectare, e o apoio técnico a pequenos agricultores da região de Nampula. Estamos comprometidos com as metas nacionais de soberania alimentar e alinhados com as directivas presidenciais para o desenvolvimento do sector agrário.',
      en: 'AGRO TRADES actively participates in the 2025/2026 Agricultural Campaign, responding to the Mozambican Government\'s call for a significant increase in food production. Our participation covers expanding cultivated areas, increasing productivity per hectare, and providing technical support to smallholder farmers in the Nampula region. We are committed to national food sovereignty goals and aligned with presidential directives for agricultural sector development.'
    },
    highlights: {
      pt: ['Alargamento das áreas de cultivo', 'Apoio a pequenos agricultores', 'Alinhamento com metas governamentais', 'Foco na soberania alimentar', 'Relatórios de progresso periódicos'],
      en: ['Expansion of cultivated areas', 'Support for smallholder farmers', 'Alignment with government targets', 'Focus on food sovereignty', 'Periodic progress reports']
    }
  },
  {
    id: 'mecanizacao', icon: '🚜',
    title: { pt: 'Mecanização agrícola', en: 'Agricultural Mechanisation' },
    summary: {
      pt: 'Aluguer e operação de equipamentos agrícolas modernos — tractores, ceifeiras e alfaias — para produtores locais, cooperativas e associações de agricultores.',
      en: 'Rental and operation of modern agricultural equipment — tractors, harvesters and implements — for local producers, cooperatives and farmer associations.'
    },
    description: {
      pt: 'O acesso à mecanização é um dos maiores desafios dos pequenos e médios agricultores moçambicanos. A AGRO TRADES oferece serviços de mecanização agrícola que permitem a qualquer produtor aceder a tractores, ceifeiras-debulhadoras, semeadores mecânicos e outras alfaias de alta performance. Trabalhamos com preços acessíveis e calendários flexíveis para garantir que a mecanização chega a quem mais precisa, na altura certa da campanha.',
      en: 'Access to mechanisation is one of the greatest challenges for small and medium-sized Mozambican farmers. AGRO TRADES offers agricultural mechanisation services that allow any producer to access tractors, combine harvesters, mechanical seeders and other high-performance implements. We work with affordable prices and flexible schedules to ensure mechanisation reaches those who need it most, at the right time in the campaign.'
    },
    highlights: {
      pt: ['Tractores e alfaias para aluguer', 'Ceifeiras-debulhadoras para colheita', 'Operadores incluídos no serviço', 'Preços acessíveis e calendário flexível', 'Manutenção e apoio técnico garantidos'],
      en: ['Tractors and implements for hire', 'Combine harvesters for crop collection', 'Operators included in the service', 'Affordable prices and flexible schedule', 'Guaranteed maintenance and technical support']
    }
  },
  {
    id: 'apoio-tecnico', icon: '👨‍🌾',
    title: { pt: 'Apoio técnico no campo', en: 'Field Technical Support' },
    summary: {
      pt: 'Assistência técnica especializada directamente no campo, incluindo orientação sobre boas práticas agrícolas, uso de sementes melhoradas e controlo de pragas.',
      en: 'Specialist technical assistance directly in the field, covering good agricultural practices, improved seed use and pest control.'
    },
    description: {
      pt: 'O nosso serviço de apoio técnico leva conhecimento especializado directamente ao campo, onde é mais necessário. Técnicos agrícolas qualificados acompanham os agricultores parceiros desde a preparação do solo até à colheita, fornecendo orientação prática sobre selecção de sementes, densidades de sementeira, adubação, gestão da água e controlo de pragas e doenças. Este serviço é especialmente valioso para agricultores que fazem a transição para práticas mais modernas e produtivas.',
      en: 'Our technical support service brings specialist knowledge directly to the field where it is most needed. Qualified agricultural technicians accompany partner farmers from soil preparation to harvest, providing practical guidance on seed selection, planting densities, fertilisation, water management and pest and disease control. This service is especially valuable for farmers transitioning to more modern and productive practices.'
    },
    highlights: {
      pt: ['Técnicos qualificados no campo', 'Orientação sobre selecção de sementes', 'Gestão de pragas e doenças', 'Formação em boas práticas agrícolas', 'Acompanhamento desde a sementeira até à colheita'],
      en: ['Qualified technicians in the field', 'Seed selection guidance', 'Pest and disease management', 'Good agricultural practice training', 'Monitoring from sowing to harvest']
    }
  },
  {
    id: 'comercializacao', icon: '🤝',
    title: { pt: 'Comercialização agrícola', en: 'Agricultural Marketing' },
    summary: {
      pt: 'Apoio na comercialização da produção agrícola, ligando os produtores ao mercado e garantindo escoamento eficiente da produção a preços justos.',
      en: 'Support in marketing agricultural production, connecting producers to the market and ensuring efficient sale at fair prices.'
    },
    description: {
      pt: 'Um dos maiores obstáculos à prosperidade dos agricultores moçambicanos é a dificuldade em escoar a produção a preços justos. A AGRO TRADES actua como intermediário de confiança, ligando produtores locais a compradores, mercados regionais e circuitos de distribuição estabelecidos. Apoiamos negociações, facilitamos logística e garantimos transparência em todas as transacções, assegurando que o produtor receba uma remuneração justa pelo seu trabalho.',
      en: 'One of the biggest obstacles to the prosperity of Mozambican farmers is the difficulty in selling production at fair prices. AGRO TRADES acts as a trusted intermediary, connecting local producers to buyers, regional markets and established distribution channels. We support negotiations, facilitate logistics and ensure transparency in all transactions, making sure the producer receives fair remuneration for their work.'
    },
    highlights: {
      pt: ['Ligação directa a compradores e mercados', 'Apoio em negociações comerciais', 'Logística e transporte da produção', 'Preços justos e transparência total', 'Rede de contactos regional estabelecida'],
      en: ['Direct link to buyers and markets', 'Support in commercial negotiations', 'Production logistics and transport', 'Fair prices and full transparency', 'Established regional contact network']
    }
  }
];

// ── LANGUAGE SYSTEM ──
const translations = {
  pt: {
    nav_home: 'Início', nav_services: 'Serviços', nav_campaign: 'Campanha 2025/26', nav_contact: 'Contactos',
    hero_tag: 'Empresa Agrícola Moçambicana',
    hero_h1a: 'Soberania começa', hero_h1b: 'no prato.',
    hero_motto: '"Trabalhar a terra é criar riqueza para Moçambique"',
    hero_p: 'Somos uma empresa moçambicana dedicada à produção agrícola, com foco no arroz, cereais, legumes, mecanização agrícola e processamento industrial.',
    btn_whatsapp: 'Fale connosco no WhatsApp',
    btn_services: 'Ver serviços',
    btn_campaign: 'Campanha 2025/2026',
    btn_contact: 'Contactos',
    stat1: 'Anos de actividade', stat2: 'Hectares cultivados', stat3: 'Serviços agrícolas', stat4: 'Distrito de Moma',
    about_tag: 'Sobre a empresa',
    about_title: 'Quem somos',
    about_p: 'A AGRO TRADES, LDA é uma empresa moçambicana dedicada ao desenvolvimento agrícola, com foco na produção de arroz, outros cereais e legumes, preparação de terras, mecanização agrícola, apoio técnico no campo, comercialização agrícola e processamento industrial.',
    about_p2: 'A empresa contribui para o fortalecimento da soberania alimentar em Moçambique, promovendo o trabalho no campo, a valorização da terra, a criação de emprego e o aumento da produção nacional.',
    services_tag: 'O que fazemos',
    services_title: 'Os nossos serviços',
    campanha_title: 'Campanha Agrícola 2025/2026',
    campanha_p: 'Iniciámos as operações da nova campanha agrícola, alinhada com o incentivo do Presidente da República Daniel Chapo. A soberania alimentar começa com a valorização da terra.',
    campanha_btn: 'Saber mais',
    location_office: 'Escritório Sede',
    location_field: 'Machamba',
    contact_tag: 'Fale connosco',
    contact_title: 'Contactos',
    contact_phone_label: 'Telefone / WhatsApp',
    contact_email_label: 'Email',
    footer_services: 'Serviços',
    footer_links: 'Links',
    footer_copy: '© 2025 AGRO TRADES, LDA. Todos os direitos reservados.',
    footer_made: 'Nampula, Moçambique',
    ceo_label: 'CEO',
    sd_highlights: 'Destaques'
  },
  en: {
    nav_home: 'Home', nav_services: 'Services', nav_campaign: 'Campaign 2025/26', nav_contact: 'Contacts',
    hero_tag: 'Mozambican Agricultural Company',
    hero_h1a: 'Sovereignty starts', hero_h1b: 'on the plate.',
    hero_motto: '"Working the land is creating wealth for Mozambique"',
    hero_p: 'We are a Mozambican company dedicated to agricultural production, focused on rice, cereals, vegetables, agricultural mechanisation and industrial processing.',
    btn_whatsapp: 'Contact us on WhatsApp',
    btn_services: 'Our services',
    btn_campaign: 'Campaign 2025/2026',
    btn_contact: 'Contacts',
    stat1: 'Years of activity', stat2: 'Hectares cultivated', stat3: 'Agricultural services', stat4: 'Moma District',
    about_tag: 'About us',
    about_title: 'Who we are',
    about_p: 'AGRO TRADES, LDA is a Mozambican company dedicated to agricultural development, focusing on rice production, other cereals and vegetables, land preparation, agricultural mechanisation, technical field support, agricultural marketing and industrial processing.',
    about_p2: 'The company contributes to strengthening food sovereignty in Mozambique, promoting fieldwork, land appreciation, job creation and increased national production.',
    services_tag: 'What we do',
    services_title: 'Our services',
    campanha_title: 'Agricultural Campaign 2025/2026',
    campanha_p: 'We have started operations for the new agricultural campaign, aligned with the initiative of President Daniel Chapo. Food sovereignty begins with valuing the land.',
    campanha_btn: 'Learn more',
    location_office: 'Head Office',
    location_field: 'Farm',
    contact_tag: 'Get in touch',
    contact_title: 'Contacts',
    contact_phone_label: 'Phone / WhatsApp',
    contact_email_label: 'Email',
    footer_services: 'Services',
    footer_links: 'Links',
    footer_copy: '© 2025 AGRO TRADES, LDA. All rights reserved.',
    footer_made: 'Nampula, Mozambique',
    ceo_label: 'CEO',
    sd_highlights: 'Highlights'
  }
};

let currentLang = localStorage.getItem('lang') || 'pt';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    const key = el.getAttribute('data-i18n-href');
    if (translations[lang][key]) el.setAttribute('href', translations[lang][key]);
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  document.documentElement.lang = lang;
}

// ── MOBILE MENU ──
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const langSw = document.querySelector('.lang-switcher');
  links.classList.toggle('open');
  if (langSw) langSw.classList.toggle('open');
}

// ── SCROLL NAV SHADOW ──
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) nav.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.08)' : 'none';
});

// ── SERVICE DETAIL PAGE ──
function renderServiceDetail() {
  const id = new URLSearchParams(window.location.search).get('id');
  const service = SERVICES.find(s => s.id === id);
  const lang = currentLang;

  if (!service) {
    document.getElementById('sd-icon').textContent = '🌿';
    document.getElementById('sd-title').textContent = lang === 'pt' ? 'Serviço não encontrado' : 'Service not found';
    document.getElementById('sd-summary').textContent = lang === 'pt' ? 'O serviço que procura não existe.' : 'The service you are looking for does not exist.';
    document.getElementById('sd-description').textContent = '';
    document.getElementById('sd-highlights').innerHTML = '';
    return;
  }

  document.title = service.title[lang] + ' — AGRO TRADES, LDA';
  document.getElementById('sd-icon').textContent = service.icon;
  document.getElementById('sd-title').textContent = service.title[lang];
  document.getElementById('sd-summary').textContent = service.summary[lang];
  document.getElementById('sd-description').textContent = service.description[lang];
  document.getElementById('sd-highlights').innerHTML = service.highlights[lang]
    .map(h => `<li><span class="sd-check">✓</span>${h}</li>`)
    .join('');

  // update back link to preserve lang
  const backLinks = document.querySelectorAll('.sd-back');
  backLinks.forEach(l => l.href = 'servicos.html');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);
  // mark active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
  // render service detail if on that page
  if (document.getElementById('sd-title')) renderServiceDetail();
});

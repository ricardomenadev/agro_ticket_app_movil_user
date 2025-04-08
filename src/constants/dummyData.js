// Datos de ejemplo para la aplicación

// Noticias para la pantalla de inicio
export const news = [
    {
      id: 1,
      title: "AGRONEA 2025 abre sus puertas el 4 de julio",
      summary: "Con más de 300 expositores y las últimas innovaciones en tecnología agrícola",
      date: "15/03/2025",
      image: "/api/placeholder/350/180"
    },
    {
      id: 2,
      title: "Confirman expositores internacionales",
      summary: "Empresas de EE.UU, Brasil y Europa confirman su participación en AGRONEA 2025",
      date: "12/03/2025",
      image: "/api/placeholder/350/180"
    },
    {
      id: 3,
      title: "Charlas y conferencias destacadas",
      summary: "Conoce a los expertos que compartirán su conocimiento en esta edición",
      date: "10/03/2025",
      image: "/api/placeholder/350/180"
    }
  ];
  
  // Expositores destacados
  export const featuredExhibitors = [
    { id: 1, name: "AgriTech Solutions", category: "Tecnología", logo: "/api/placeholder/80/80" },
    { id: 2, name: "MaquiAgro", category: "Maquinaria", logo: "/api/placeholder/80/80" },
    { id: 3, name: "SemillasPlus", category: "Insumos", logo: "/api/placeholder/80/80" },
    { id: 4, name: "Agricultura Digital", category: "Software", logo: "/api/placeholder/80/80" }
  ];
  
  // Lista completa de expositores
  export const exhibitors = [
    { id: 1, name: "AgriTech Solutions", category: "tech", stand: "A-15", description: "Tecnología de punta para el sector agrícola", logo: "/api/placeholder/120/120", highlighted: true },
    { id: 2, name: "MaquiAgro", category: "machinery", stand: "B-22", description: "Maquinaria agrícola de última generación", logo: "/api/placeholder/120/120", highlighted: true },
    { id: 3, name: "SemillasPlus", category: "seeds", stand: "C-08", description: "Semillas de alta calidad y rendimiento", logo: "/api/placeholder/120/120", highlighted: false },
    { id: 4, name: "AgriConsulting", category: "services", stand: "D-12", description: "Asesoramiento profesional para productores", logo: "/api/placeholder/120/120", highlighted: false },
    { id: 5, name: "TechnoField", category: "tech", stand: "A-20", description: "Soluciones digitales para el campo", logo: "/api/placeholder/120/120", highlighted: false },
    { id: 6, name: "GanaderíaTotal", category: "livestock", stand: "E-05", description: "Todo para el sector ganadero", logo: "/api/placeholder/120/120", highlighted: false }
  ];
  
  // Categorías de expositores
  export const exhibitorCategories = [
    { id: 'all', name: 'Todos' },
    { id: 'machinery', name: 'Maquinaria' },
    { id: 'seeds', name: 'Semillas' },
    { id: 'tech', name: 'Tecnología' },
    { id: 'services', name: 'Servicios' },
    { id: 'livestock', name: 'Ganadería' }
  ];
  
  // Productos para la tienda
  export const products = [
    { id: 1, name: "Entrada General", category: "tickets", price: 5000, description: "Acceso por un día al evento", image: "/api/placeholder/200/150" },
    { id: 2, name: "Entrada VIP", category: "tickets", price: 10000, description: "Acceso VIP con beneficios exclusivos", image: "/api/placeholder/200/150" },
    { id: 3, name: "Abono 3 días", category: "tickets", price: 12000, description: "Acceso completo durante los 3 días", image: "/api/placeholder/200/150" },
    { id: 4, name: "Estacionamiento - 1 día", category: "parking", price: 2500, description: "Acceso al estacionamiento por un día", image: "/api/placeholder/200/150" },
    { id: 5, name: "Estacionamiento - 3 días", category: "parking", price: 6000, description: "Acceso al estacionamiento durante los 3 días", image: "/api/placeholder/200/150" },
    { id: 6, name: "Gorra AGRONEA", category: "merch", price: 7500, description: "Gorra oficial del evento", image: "/api/placeholder/200/150" },
    { id: 7, name: "Remera AGRONEA", category: "merch", price: 9000, description: "Remera conmemorativa edición 2025", image: "/api/placeholder/200/150" },
    { id: 8, name: "Botella Térmica", category: "merch", price: 12000, description: "Botella oficial AGRONEA", image: "/api/placeholder/200/150" }
  ];
  
  // Categorías de productos
  export const productCategories = [
    { id: 'all', name: 'Todos' },
    { id: 'tickets', name: 'Entradas' },
    { id: 'parking', name: 'Estacionamiento' },
    { id: 'merch', name: 'Productos' }
  ];
  
  // Datos de programación del evento
  export const scheduleData = [
    {
      date: "4 de Julio",
      events: [
        { id: 1, time: "08:00", title: "Apertura de puertas", location: "Entrada Principal" },
        { id: 2, time: "10:00", title: "Conferencia Inaugural", location: "Auditorio Principal", speaker: "Dr. Juan Pérez" },
        { id: 3, time: "12:30", title: "Almuerzo Networking", location: "Patio Central" },
        { id: 4, time: "14:30", title: "Demostración de Maquinaria", location: "Campo Experimental" },
        { id: 5, time: "17:00", title: "Panel: Innovación Agrícola", location: "Sala A", speaker: "Varios especialistas" }
      ]
    },
    {
      date: "5 de Julio",
      events: [
        { id: 6, time: "08:00", title: "Apertura de puertas", location: "Entrada Principal" },
        { id: 7, time: "09:30", title: "Workshop: Agricultura Sostenible", location: "Sala B", speaker: "Ing. María López" },
        { id: 8, time: "12:00", title: "Almuerzo", location: "Patio Central" },
        { id: 9, time: "14:00", title: "Demostración: Drones en Agricultura", location: "Campo Abierto" },
        { id: 10, time: "16:30", title: "Charla: Mercados Internacionales", location: "Auditorio Principal", speaker: "Lic. Roberto Gómez" }
      ]
    },
    {
      date: "6 de Julio",
      events: [
        { id: 11, time: "08:00", title: "Apertura de puertas", location: "Entrada Principal" },
        { id: 12, time: "10:00", title: "Panel: Futuro del Agro", location: "Auditorio Principal", speaker: "Varios especialistas" },
        { id: 13, time: "12:30", title: "Almuerzo de Cierre", location: "Patio Central" },
        { id: 14, time: "14:30", title: "Entrega de Premios a la Innovación", location: "Escenario Principal" },
        { id: 15, time: "18:00", title: "Ceremonia de Clausura", location: "Auditorio Principal" }
      ]
    }
  ];
  
  // Información del predio
  export const venueData = {
    address: "Ruta 94, Km 20, Charata, Chaco",
    coordinates: { lat: -27.2142, lng: -61.1983 },
    sections: [
      { id: 1, name: "Sector A", description: "Maquinaria Agrícola" },
      { id: 2, name: "Sector B", description: "Insumos y Semillas" },
      { id: 3, name: "Sector C", description: "Tecnología y Servicios" },
      { id: 4, name: "Sector D", description: "Ganadería" },
      { id: 5, name: "Auditorio", description: "Conferencias y Charlas" },
      { id: 6, name: "Campo Experimental", description: "Demostraciones en vivo" }
    ]
  };
  
  // Eventos del usuario para el planificador
  export const userEvents = [
    { 
      id: 1,
      title: "Conferencia Inaugural",
      date: "4 de Julio",
      time: "10:00 - 12:00",
      location: "Auditorio Principal",
      reminder: true
    },
    { 
      id: 2,
      title: "Demostración de Maquinaria",
      date: "5 de Julio",
      time: "14:30 - 16:30",
      location: "Campo Experimental",
      reminder: false
    },
    { 
      id: 3,
      title: "Panel: Sustentabilidad",
      date: "6 de Julio",
      time: "11:00 - 13:00",
      location: "Sala Verde",
      reminder: true
    }
  ];
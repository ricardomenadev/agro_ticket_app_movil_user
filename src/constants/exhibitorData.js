// Datos detallados de expositores para la aplicación
export const detailedExhibitors = {
    // John Deere
    johndeere: {
      id: 'johndeere',
      name: 'John Deere',
      logo: 'https://via.placeholder.com/200/0A8F3C/FFFFFF?text=JD',
      coverPhoto: 'https://via.placeholder.com/800/0A8F3C/FFFFFF?text=John+Deere+Cover',
      description: 'Con más de 180 años de experiencia, John Deere es líder mundial en el suministro de productos, tecnologías y servicios avanzados para la agricultura. Nuestra misión es mejorar la calidad de vida de las personas a través de la innovación en equipos agrícolas.',
      stand: 'A-12',
      sector: 'Maquinaria Agrícola',
      highlighted: true,
      verified: true,
      since: 1837,
      website: 'www.deere.com',
      email: 'info@johndeere.com',
      phone: '+54 11 4555-1234',
      address: 'Av. del Libertador 498, Buenos Aires',
      socialMedia: {
        facebook: 'https://facebook.com/johndeere',
        instagram: 'https://instagram.com/johndeere',
        twitter: 'https://twitter.com/johndeere',
        youtube: 'https://youtube.com/johndeere'
      },
      products: [
        {
          id: 1,
          name: 'Tractor Serie 6M',
          image: 'https://via.placeholder.com/300/0A8F3C/FFFFFF?text=Tractor+6M',
          price: 'Consultar',
          description: 'El compañero ideal para tareas exigentes con eficiencia de combustible mejorada.'
        },
        {
          id: 2,
          name: 'Cosechadora S790',
          image: 'https://via.placeholder.com/300/0A8F3C/FFFFFF?text=Cosechadora',
          price: 'Consultar',
          description: 'Maximice su productividad y eficiencia con nuestra cosechadora insignia.'
        },
        {
          id: 3,
          name: 'Pulverizadora M4000',
          image: 'https://via.placeholder.com/300/0A8F3C/FFFFFF?text=Pulverizadora',
          price: 'Consultar',
          description: 'La precisión y potencia que su cultivo necesita en una pulverizadora de última generación.'
        }
      ],
      news: [
        {
          id: 1,
          title: 'Nueva tecnología de agricultura de precisión',
          date: '20/03/2025',
          image: 'https://via.placeholder.com/400/0A8F3C/FFFFFF?text=Precision+Tech',
          summary: 'Lanzamos nuestro sistema de agricultura de precisión con mapeo en tiempo real y ajuste automático para maximizar el rendimiento de sus cultivos.'
        },
        {
          id: 2,
          title: 'Financiación especial para AGRONEA 2025',
          date: '15/03/2025',
          image: 'https://via.placeholder.com/400/0A8F3C/FFFFFF?text=Financiacion',
          summary: 'Aprovecha nuestras condiciones especiales de financiación disponibles exclusivamente durante AGRONEA 2025.'
        }
      ],
      events: [
        {
          id: 1,
          title: 'Demostración en vivo de tractores Serie 6M',
          date: '4 de Julio',
          time: '14:30',
          location: 'Campo Experimental'
        },
        {
          id: 2,
          title: 'Charla: El futuro de la Agricultura 4.0',
          date: '5 de Julio',
          time: '11:00',
          location: 'Stand A-12'
        },
        {
          id: 3,
          title: 'Workshop: Optimización de flotas agrícolas',
          date: '6 de Julio',
          time: '10:30',
          location: 'Sala de Conferencias B'
        }
      ],
      gallery: [
        'https://via.placeholder.com/400/0A8F3C/FFFFFF?text=JD+Image+1',
        'https://via.placeholder.com/400/0A8F3C/FFFFFF?text=JD+Image+2',
        'https://via.placeholder.com/400/0A8F3C/FFFFFF?text=JD+Image+3',
        'https://via.placeholder.com/400/0A8F3C/FFFFFF?text=JD+Image+4',
        'https://via.placeholder.com/400/0A8F3C/FFFFFF?text=JD+Image+5'
      ],
      achievements: [
        'Líder mundial en maquinaria agrícola',
        'Más de 60.000 empleados en todo el mundo',
        'Presente en más de 160 países',
        'Premio a la Innovación Agrícola 2024'
      ]
    },
    
    // CASE IH
    caseih: {
      id: 'caseih',
      name: 'CASE IH',
      logo: 'https://via.placeholder.com/200/B21830/FFFFFF?text=CASE',
      coverPhoto: 'https://via.placeholder.com/800/B21830/FFFFFF?text=CASE+IH+Cover',
      description: 'CASE IH ofrece equipos agrícolas de alta potencia y rendimiento para operaciones comerciales modernas. Con más de 175 años de experiencia, nuestros productos innovadores y soluciones de agricultura de precisión ayudan a los productores a maximizar su productividad y rentabilidad.',
      stand: 'B-05',
      sector: 'Maquinaria Agrícola',
      highlighted: true,
      verified: true,
      since: 1842,
      website: 'www.caseih.com',
      email: 'info@caseih.com',
      phone: '+54 11 4555-5678',
      address: 'Ruta 9 Km 35, Escobar, Buenos Aires',
      socialMedia: {
        facebook: 'https://facebook.com/caseih',
        instagram: 'https://instagram.com/caseih',
        twitter: 'https://twitter.com/caseih',
        youtube: 'https://youtube.com/caseih'
      },
      products: [
        {
          id: 1,
          name: 'Tractor Maxxum 150',
          image: 'https://via.placeholder.com/300/B21830/FFFFFF?text=Maxxum+150',
          price: 'Consultar',
          description: 'Rendimiento excepcional y eficiencia de combustible para diversas aplicaciones agrícolas.'
        },
        {
          id: 2,
          name: 'Cosechadora Axial-Flow 9250',
          image: 'https://via.placeholder.com/300/B21830/FFFFFF?text=Axial-Flow',
          price: 'Consultar',
          description: 'Cosechadora de alto rendimiento con tecnología de rotor único para minimizar la pérdida de granos.'
        },
        {
          id: 3,
          name: 'Sembradora Early Riser 2150',
          image: 'https://via.placeholder.com/300/B21830/FFFFFF?text=Early+Riser',
          price: 'Consultar',
          description: 'Precisión y velocidad para una siembra perfecta y un mejor establecimiento del cultivo.'
        }
      ],
      news: [
        {
          id: 1,
          title: 'Lanzamiento: Nueva serie Magnum con AFS Connect',
          date: '25/03/2025',
          image: 'https://via.placeholder.com/400/B21830/FFFFFF?text=Magnum+AFS',
          summary: 'Presentamos la nueva Serie Magnum con AFS Connect, que combina potencia con tecnología de punta para gestión de flotas remota.'
        },
        {
          id: 2,
          title: 'Financiamiento a tasa 0% durante AGRONEA',
          date: '18/03/2025',
          image: 'https://via.placeholder.com/400/B21830/FFFFFF?text=Financiamiento',
          summary: 'Aprovecha condiciones especiales con tasa 0% en nuestros principales modelos solo durante AGRONEA 2025.'
        }
      ],
      events: [
        {
          id: 1,
          title: 'Demostración en vivo de la Serie Magnum',
          date: '4 de Julio',
          time: '15:30',
          location: 'Campo Experimental'
        },
        {
          id: 2,
          title: 'Charla: Agricultura de Precisión con AFS Connect',
          date: '5 de Julio',
          time: '14:00',
          location: 'Stand B-05'
        },
        {
          id: 3,
          title: 'Workshop: Optimización de operaciones agrícolas',
          date: '6 de Julio',
          time: '11:30',
          location: 'Sala de Conferencias A'
        }
      ],
      gallery: [
        'https://via.placeholder.com/400/B21830/FFFFFF?text=CASE+Image+1',
        'https://via.placeholder.com/400/B21830/FFFFFF?text=CASE+Image+2',
        'https://via.placeholder.com/400/B21830/FFFFFF?text=CASE+Image+3',
        'https://via.placeholder.com/400/B21830/FFFFFF?text=CASE+Image+4',
        'https://via.placeholder.com/400/B21830/FFFFFF?text=CASE+Image+5'
      ],
      achievements: [
        'Líder en innovación agrícola desde 1842',
        'Presente en más de 140 países',
        'Premio a la Eficiencia Agrícola 2024',
        'Más de 50 patentes en tecnologías exclusivas'
      ]
    },
  
    // New Holland
    newholland: {
      id: 'newholland',
      name: 'New Holland',
      logo: 'https://via.placeholder.com/200/006CB7/FFFFFF?text=NH',
      coverPhoto: 'https://via.placeholder.com/800/006CB7/FFFFFF?text=New+Holland+Cover',
      description: 'New Holland Agriculture ofrece a los agricultores de todo el mundo una gama completa de productos innovadores y soluciones tecnológicas. Desde 1895, nos hemos comprometido con una agricultura más inteligente, sostenible y eficiente en todo el mundo.',
      stand: 'C-08',
      sector: 'Maquinaria Agrícola',
      highlighted: true,
      verified: true,
      since: 1895,
      website: 'www.newholland.com',
      email: 'contacto@newholland.com',
      phone: '+54 11 4555-7890',
      address: 'Ruta 9 Km 79, Campana, Buenos Aires',
      socialMedia: {
        facebook: 'https://facebook.com/newholland',
        instagram: 'https://instagram.com/newholland',
        twitter: 'https://twitter.com/newholland',
        youtube: 'https://youtube.com/newholland'
      },
      products: [
        {
          id: 1,
          name: 'Tractor T7 Heavy Duty',
          image: 'https://via.placeholder.com/300/006CB7/FFFFFF?text=T7+HD',
          price: 'Consultar',
          description: 'Diseñado para exigentes tareas en campo abierto con la máxima eficiencia y potencia.'
        },
        {
          id: 2,
          name: 'Cosechadora CR Revelation',
          image: 'https://via.placeholder.com/300/006CB7/FFFFFF?text=CR+Revelation',
          price: 'Consultar',
          description: 'La tecnología exclusiva de doble rotor proporciona una calidad superior de grano.'
        },
        {
          id: 3,
          name: 'Empacadora BigBaler 1290',
          image: 'https://via.placeholder.com/300/006CB7/FFFFFF?text=BigBaler',
          price: 'Consultar',
          description: 'Producción de pacas de alta densidad con la máxima capacidad y fiabilidad.'
        }
      ],
      news: [
        {
          id: 1,
          title: 'Presentación del sistema PLM Intelligence',
          date: '22/03/2025',
          image: 'https://via.placeholder.com/400/006CB7/FFFFFF?text=PLM+Intelligence',
          summary: 'Nueva generación de agricultura de precisión con datos en tiempo real y optimización de rendimiento.'
        },
        {
          id: 2,
          title: 'Línea de financiación exclusiva para AGRONEA',
          date: '16/03/2025',
          image: 'https://via.placeholder.com/400/006CB7/FFFFFF?text=Financiacion',
          summary: 'Condiciones excepcionales de financiación para toda nuestra línea de productos durante el evento.'
        }
      ],
      events: [
        {
          id: 1,
          title: 'Demostración: Cosechadoras CR Revelation',
          date: '4 de Julio',
          time: '16:00',
          location: 'Campo Experimental'
        },
        {
          id: 2,
          title: 'Presentación: Agricultura Sostenible',
          date: '5 de Julio',
          time: '12:30',
          location: 'Stand C-08'
        },
        {
          id: 3,
          title: 'Charla: Optimización del rendimiento en campo',
          date: '6 de Julio',
          time: '13:00',
          location: 'Auditorio Principal'
        }
      ],
      gallery: [
        'https://via.placeholder.com/400/006CB7/FFFFFF?text=NH+Image+1',
        'https://via.placeholder.com/400/006CB7/FFFFFF?text=NH+Image+2',
        'https://via.placeholder.com/400/006CB7/FFFFFF?text=NH+Image+3',
        'https://via.placeholder.com/400/006CB7/FFFFFF?text=NH+Image+4',
        'https://via.placeholder.com/400/006CB7/FFFFFF?text=NH+Image+5'
      ],
      achievements: [
        'Pioneros en tecnología de doble rotor para cosechadoras',
        'Presente en más de 170 países',
        'Premio a la Innovación en Agricultura Sostenible 2024',
        'Más de 20 años desarrollando soluciones de agricultura de precisión'
      ]
    }
  };
  
  // Función auxiliar para obtener un expositor por ID
  export const getExhibitorById = (id) => {
    return detailedExhibitors[id] || null;
  };
  
  // Función para enriquecer los datos básicos de expositores
  // Útil para cuando se necesitan datos básicos mejorados en listados
  export const enrichExhibitorData = (basicExhibitor) => {
    // Si existe información detallada para este expositor
    if (detailedExhibitors[basicExhibitor.id]) {
      const detailedData = detailedExhibitors[basicExhibitor.id];
      
      // Añadir campos adicionales de los datos detallados
      return {
        ...basicExhibitor,
        verified: detailedData.verified || false,
        sector: detailedData.sector,
        website: detailedData.website,
        description: detailedData.description || basicExhibitor.description,
        // Añadir solo algunos campos para mantener la lista ligera
      };
    }
    
    // Si no hay datos detallados, devolver el objeto original
    return basicExhibitor;
  };
  
  // Exportar una lista de expositores enriquecida para usar en pantallas de listado
  export const enhancedExhibitorsList = [
    {
      id: 'johndeere',
      name: 'John Deere',
      category: 'machinery',
      stand: 'A-12',
      description: 'Líder mundial en maquinaria agrícola con soluciones innovadoras',
      logo: 'https://via.placeholder.com/200/0A8F3C/FFFFFF?text=JD',
      highlighted: true,
      verified: true
    },
    {
      id: 'caseih',
      name: 'CASE IH',
      category: 'machinery',
      stand: 'B-05',
      description: 'Equipos agrícolas de alta potencia y rendimiento para operaciones comerciales',
      logo: 'https://via.placeholder.com/200/B21830/FFFFFF?text=CASE',
      highlighted: true,
      verified: true
    },
    {
      id: 'newholland',
      name: 'New Holland',
      category: 'machinery',
      stand: 'C-08',
      description: 'Soluciones innovadoras para una agricultura más inteligente y sostenible',
      logo: 'https://via.placeholder.com/200/006CB7/FFFFFF?text=NH',
      highlighted: true,
      verified: true
    },
    {
      id: 'basf',
      name: 'BASF',
      category: 'seeds',
      stand: 'D-14',
      description: 'Soluciones en protección de cultivos y semillas de alto rendimiento',
      logo: 'https://via.placeholder.com/200/007c32/FFFFFF?text=BASF',
      highlighted: false,
      verified: true
    },
    {
      id: 'don-mario',
      name: 'Don Mario Semillas',
      category: 'seeds',
      stand: 'D-22',
      description: 'Genética de vanguardia para maximizar el rendimiento de su campo',
      logo: 'https://via.placeholder.com/200/FFC107/000000?text=DM',
      highlighted: false,
      verified: false
    },
    {
      id: 'agrotec',
      name: 'AgroTec Solutions',
      category: 'tech',
      stand: 'E-05',
      description: 'Tecnología de punta para monitoreo de cultivos y gestión de datos',
      logo: 'https://via.placeholder.com/200/3F51B5/FFFFFF?text=AT',
      highlighted: false,
      verified: false
    }
  ];
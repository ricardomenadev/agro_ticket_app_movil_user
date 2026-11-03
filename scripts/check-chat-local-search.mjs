// Prueba rápida del chat sin internet: node scripts/check-chat-local-search.mjs
import assert from 'node:assert/strict';
import { localAnswer } from '../src/services/chatLocalSearch.js';

const data = {
  faqs: [
    { topic: 'visitante', pregunta: 'Novedades y contacto', respuesta: 'Todavía no hay novedades de la próxima edición.\n\nOficina: Caseros 539, Charata. Lunes a viernes de 8 a 12.' },
    { topic: 'expositor', pregunta: 'Stands para la próxima edición', respuesta: 'Todavía no abrimos la venta de stands.\n\nCada stand tiene electricidad de 220 voltios.' },
  ],
};

assert.deepEqual(localAnswer('mi mail es Ana@campo.com.ar', data, 'expositor'), { type: 'email', email: 'Ana@campo.com.ar' });
assert.equal(localAnswer('Hola!', data, 'visitante').type, 'welcome');
assert.match(localAnswer('dónde queda la oficina?', data, 'visitante').text, /Caseros 539/);
assert.match(localAnswer('hay electricidad en el stand?', data, 'expositor').text, /220 voltios/);
assert.equal(localAnswer('hay electricidad en el stand?', data, 'visitante').type, 'none'); // no mezcla temas
assert.equal(localAnswer('quién ganó el mundial', data, 'visitante').type, 'none');
assert.equal(localAnswer('electricidad', { faqs: [] }, null).type, 'none'); // celular sin datos guardados
console.log('chat sin internet: OK');

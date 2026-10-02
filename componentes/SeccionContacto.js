/**
 * Componente Declarativo: Sección Contacto.
 * Renderiza los canales de comunicación directa y el botón de WhatsApp.
 */
import { crearElemento, crearElementoSvg } from '../scripts/utilidadesDom.js';

export function renderizarSeccionContacto(contenedor) {
  if (!contenedor) return;

  const fondo = crearElemento('div', { className: 'contacto-bg' });

  const cuerpo = crearElemento('div', { className: 'container contacto-inner' }, [
    crearElemento('div', { className: 'reveal', style: { maxWidth: '540px' } }, [
      crearElemento('p', { className: 'section-label' }, ['Escribinos']),
      crearElemento('h2', { className: 'section-title' }, ['Contactanos']),
      crearElemento('div', { className: 'divider' })
    ]),
    crearElemento('div', { className: 'contacto-grid' }, [
      crearTarjetaContacto({
        href: 'https://wa.me/541140686925',
        etiqueta: 'Teléfono / WhatsApp',
        valor: '(011) 15-4068-6925',
        delay: '',
        path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'
      }),
      crearTarjetaContacto({
        href: 'mailto:jorgeotripodi@hotmail.com',
        etiqueta: 'Correo Electrónico',
        valor: 'jorgeotripodi@hotmail.com',
        delay: 'reveal-delay-1',
        isStroke: true,
        path: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'
      }),
      crearTarjetaContacto({
        href: 'https://www.facebook.com/neoproduccionestm/',
        etiqueta: 'Facebook',
        valor: 'neoproduccionestm',
        delay: 'reveal-delay-2',
        path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
      }),
      crearTarjetaContacto({
        href: 'https://www.instagram.com/neo_producciones_tm/',
        etiqueta: 'Instagram',
        valor: '@neo_producciones_tm',
        delay: 'reveal-delay-3',
        path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'
      })
    ]),
    crearElemento('div', { className: 'contacto-cta reveal' }, [
      crearElemento('h3', {}, ['¿Listo para capturar tus momentos?']),
      crearElemento('p', {}, ['Contactanos para una consulta personalizada. Respondemos en menos de 24 horas y te ofrecemos un presupuesto adaptado a tus necesidades.']),
      crearElemento('a', { href: 'https://wa.me/541140686925', target: '_blank', className: 'btn-primary' }, [
        crearElementoSvg('svg', { width: '18', height: '18', fill: 'currentColor', viewBox: '0 0 24 24' }, [
          crearElementoSvg('path', { d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' })
        ]),
        ' Escribinos por WhatsApp'
      ])
    ])
  ]);

  contenedor.replaceChildren(fondo, cuerpo);
}

function crearTarjetaContacto({ href, etiqueta, valor, delay, isStroke, path }) {
  const atributosSvg = isStroke
    ? { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }
    : { fill: 'currentColor', viewBox: '0 0 24 24' };

  return crearElemento('a', { href, target: '_blank', className: `contacto-card reveal ${delay}`.trim() }, [
    crearElemento('div', { className: 'contacto-icon' }, [
      crearElementoSvg('svg', atributosSvg, [
        crearElementoSvg('path', { d: path })
      ])
    ]),
    crearElemento('div', {}, [
      crearElemento('div', { className: 'contacto-label' }, [etiqueta]),
      crearElemento('div', { className: 'contacto-value' }, [valor])
    ])
  ]);
}

import {
  randomDate,
  generateGuid,
  obtenerNumeroDeVecesPorCadaElementoDeUnArray,
  obtenerArrayDeObjeto,
  tokenHaExpirado,
  tiempoDeExpiracion,
} from './helpers.js';
import { bbdd, sobreEscribirBBDD } from './bbdd.js';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs';
import {
  FacturaModelo,
  PagadorModelo,
  UsuarioModelo,
  TipoDeReparticionModelo,
  TipoDeFacturaModelo,
} from './modelos.model.js';
import { CredencialesDTO } from '../servicio/Requests/requests.model.js';

/* No modifican datos */
export function obtenerFacturasPorUsuarioId(usuarioId: string) {
  let facturasIds: Array<string> = obtenerArrayDeObjeto(
    bbdd.r_facturas_usuarios
  )
    .filter(
      (relacionFacturaUsuario) => relacionFacturaUsuario.usuarioId === usuarioId
    )
    .map((relacionFacturaUsuario) => relacionFacturaUsuario.facturaId);
  let facturas: Array<FacturaModelo> = obtenerArrayDeObjeto(bbdd.facturas)
    .filter((factura) => facturasIds.includes(factura.id))
    .map((factura) => new FacturaModelo(factura));
  return of(facturas).pipe(delay(1000));
}

export function obtenerPagadoresPorFacturaId(facturaId: string) {
  let pagadores: Array<PagadorModelo> = obtenerArrayDeObjeto(
    bbdd.r_facturas_usuarios
  )
    .filter(
      (relacionFacturaUsuario) => relacionFacturaUsuario.facturaId === facturaId
    )
    .map((relacionFacturaUsuario) => new PagadorModelo(relacionFacturaUsuario));
  return of(pagadores).pipe(delay(1000));
}

export function obtenerSugeridosPorUsuarioId(usuarioId: string) {
  let sugeridosIds: Array<string> = obtenerArrayDeObjeto(bbdd.sugeridos)
    .filter((sugerido) => sugerido.usuarioId === usuarioId)
    .map((sugerido) => sugerido.sugeridoId);
  let usuariosSugeridos: Array<UsuarioModelo> = obtenerArrayDeObjeto(
    bbdd.usuarios
  ).filter((usuario) => sugeridosIds.includes(usuario.id));
  return of(usuariosSugeridos).pipe(delay(1000));
}

export function obtenerUsuarios() {
  let usuarios: Array<UsuarioModelo> = obtenerArrayDeObjeto(bbdd.usuarios).map(
    (usuario) => new UsuarioModelo(usuario)
  );
  return of(usuarios).pipe(delay(1000));
}

export function obtenerUsuarioConectado() {
  let token = localStorage.getItem('token');
  let bbddToken = bbdd.tokens[token];
  let usuarioConectado = null;
  if (token && bbddToken) {
    usuarioConectado = gestionarExpiracionToken(bbddToken);
  } else {
    localStorage.setItem('bbdd', JSON.stringify(bbdd));
  }
  return of(usuarioConectado).pipe(delay(1000));
}

function gestionarExpiracionToken(bbddToken) {
  let usuarioConectado = null;
  if (tokenHaExpirado(bbddToken.fechaDeExpiracion)) {
    localStorage.removeItem('token');
  } else {
    usuarioConectado = bbdd.usuarios[bbddToken.usuarioId];
  }
  return usuarioConectado;
}

export function obtenerUsuarioPorId(usuarioId) {
  let usuario: UsuarioModelo = { ...bbdd.usuarios[usuarioId] };
  return of(usuario).pipe(delay(1000));
}

export function obtenerFacturaPorId(facturaId) {
  let factura: FacturaModelo = { ...bbdd.facturas[facturaId] };
  return of(factura).pipe(delay(1000));
}

export function obtenerContactosPorUsuarioId(usuarioId: string) {
  let contactosIds: Array<string> = obtenerArrayDeObjeto(bbdd.contactos)
    .filter((contacto) => contacto.usuarioId === usuarioId)
    .map((contacto) => contacto.contactoId);
  let contactos: Array<UsuarioModelo> = obtenerArrayDeObjeto(
    bbdd.usuarios
  ).filter((usuario) => contactosIds.includes(usuario.id));
  return of(contactos).pipe(delay(1000));
}

export function obtenerTiposDeFacturas() {
  return of(obtenerArrayDeObjeto(bbdd.tipo_de_facturas)).pipe(delay(1000));
}

/* Modifican datos */
export function anadirContacto(usuarioId, contactoId) {
  if (!usuarioId) {
    return throwError('Es obligatorio indicar el id del usuario');
  }
  if (!contactoId) {
    return throwError('Es obligatorio indicar el id del contacto a añadir');
  }
  if (usuarioId === contactoId) {
    return throwError('No puedes añadirte a ti mismo como contacto');
  }
  if (bbdd.contactos[`${usuarioId}-${contactoId}`]) {
    return throwError('Ya tienes a ese usuario como contacto');
  }
  if (!bbdd.usuarios[contactoId]) {
    return throwError('No hay un usuario id relacionado a ese contactoId');
  }
  bbdd.contactos[`${usuarioId}-${contactoId}`] = {
    usuarioId: usuarioId,
    contactoId: contactoId,
    fechaDeCreacion: randomDate(new Date(2018, 0, 1), new Date()),
  };
  localStorage.setItem('bbdd', JSON.stringify(bbdd));
  return of(bbdd.usuarios[contactoId]).pipe(delay(1000));
}

export function eliminarContacto(usuarioId, contactoId) {
  if (!usuarioId) {
    return throwError('Es obligatorio indicar el id del usuario');
  }
  if (!contactoId) {
    return throwError('Es obligatorio indicar el id del contacto a eliminar');
  }
  if (!bbdd.contactos[`${usuarioId}-${contactoId}`]) {
    return throwError('No existe relacion entre usuario y contacto');
  }
  delete bbdd.contactos[`${usuarioId}-${contactoId}`];
  localStorage.setItem('bbdd', JSON.stringify(bbdd));
  return of(null).pipe(delay(1000));
}

export function crearFactura(facturaACrear) {
  let id = generateGuid();
  let token = localStorage.getItem('token');
  let creadorId = bbdd.tokens[token].usuarioId;
  bbdd.facturas[id] = {
    id,
    total: facturaACrear.total,
    estaPagada: false,
    tipoDeReparticion: TipoDeReparticionModelo[facturaACrear.tipoDeReparticion],
    tipoDeFacturaId: facturaACrear.tipoDeFacturaId,
    fechaDeCreacion: new Date(),
    creadorId,
  };
  facturaACrear.pagadores.forEach((pagador) => {
    bbdd.r_facturas_usuarios[`${id}-${pagador.usuarioId}`] = {
      facturaId: id,
      usuarioId: pagador.usuarioId,
      totalAsignado:
        facturaACrear.tipoDeReparticion ===
        TipoDeReparticionModelo[TipoDeReparticionModelo.Igualitaria]
          ? facturaACrear.total / facturaACrear.pagadores.length
          : pagador.total,
      estaPagada: false,
    };
    gestionarSiElPagadorSeraSugerido(
      facturaACrear.creadorId,
      pagador.usuarioId
    );
  });
  localStorage.setItem('bbdd', JSON.stringify(bbdd));
  return of(bbdd.facturas[id]).pipe(delay(1000));
}

export function pagarFacturaPorId(facturaId) {
  let token = localStorage.getItem('token');
  let bbddToken = bbdd.tokens[token];
  let usuarioConectado = null;
  if (token && bbddToken) {
    usuarioConectado = gestionarExpiracionToken(bbddToken);
    bbdd.r_facturas_usuarios[
      `${facturaId}-${usuarioConectado.id}`
    ].estaPagada = true;
    if (
      !bbdd.r_facturas_usuarios[`${facturaId}-${usuarioConectado.id}`].find(
        (r) => !r.estaPagada
      )
    ) {
      bbdd.facturas[facturaId].estaPagada = true;
    }
  }
  return of(null).pipe(delay(1000));
}

function gestionarSiElPagadorSeraSugerido(creadorId, pagadorId) {
  if (creadorId === pagadorId) return;
  if (bbdd.sugeridos[`${creadorId}-${pagadorId}`]) return;
  let sugeridosIds: Array<string> = obtenerArrayDeObjeto(bbdd.sugeridos)
    .filter((sugerido) => sugerido.usuarioId === creadorId)
    .map((sugerido) => sugerido.sugeridoId);
  if (sugeridosIds.length < 5) {
    bbdd.sugeridos[`${creadorId}-${pagadorId}`] = {
      usuarioId: creadorId,
      sugeridoId: pagadorId,
      fechaDeCreacion: new Date(),
    };

    return;
  }
  var pagadoresIds = [];
  let facturasIds: Array<string> = obtenerArrayDeObjeto(
    bbdd.r_facturas_usuarios
  )
    .filter(
      (relacionFacturaUsuario) => relacionFacturaUsuario.usuarioId === creadorId
    )
    .map((relacionFacturaUsuario) => relacionFacturaUsuario.facturaId);

  let facturasDelCreador: Array<FacturaModelo> = obtenerArrayDeObjeto(
    bbdd.facturas
  )
    .filter((factura) => facturasIds.includes(factura.id))
    .map((factura) => new FacturaModelo(factura));
  facturasDelCreador.forEach((factura) => {
    pagadoresIds = [
      ...pagadoresIds,
      ...obtenerArrayDeObjeto(bbdd.r_facturas_usuarios)
        .filter(
          (relacionFacturaUsuario) =>
            relacionFacturaUsuario.facturaId === factura.id
        )
        .map((relacionFacturaUsuario) => relacionFacturaUsuario.usuarioId),
    ];
  });
  var relacionPagadoresNumeroDeFacturas = obtenerNumeroDeVecesPorCadaElementoDeUnArray(
    pagadoresIds
  );
  let nuevosSugeridosIds = obtenerArrayDeObjeto(
    relacionPagadoresNumeroDeFacturas
  )
    .filter((x) => x.contador > 1)
    .map((x) => x.id)
    .sort();
  nuevosSugeridosIds.forEach((nuevoSugerido) => {
    if (!sugeridosIds.includes(nuevoSugerido)) {
      bbdd.sugeridos[`${creadorId}-${pagadorId}`] = {
        usuarioId: creadorId,
        sugeridoId: pagadorId,
        fechaDeCreacion: new Date(),
      };
    }
  });
}

export function crearUsuario(usuarioACrear) {
  let id = generateGuid();
  bbdd.usuarios[id] = {
    id,
    nombre: usuarioACrear.nombre,
    apellidos: usuarioACrear.apellidos,
    telefono: '+34 661333454',
    avatarURL: `https://api.adorable.io/avatars/${id}`,
    fechaDeCreacion: randomDate(new Date(2018, 0, 1), new Date()),
  };
  localStorage.setItem('bbdd', JSON.stringify(bbdd));
  return of(bbdd.usuarios[id]).pipe(delay(1000));
}

export function login(credenciales: CredencialesDTO) {
  let usuario: UsuarioModelo = { ...bbdd.usuarios[credenciales.id] };
  let token = generateGuid();
  bbdd.tokens = {
    [token]: {
      usuarioId: usuario.id,
      fechaDeExpiracion: new Date().getTime() + tiempoDeExpiracion, //2 horas y expira
    },
  };
  localStorage.setItem('bbdd', JSON.stringify(bbdd));
  return of(token).pipe(delay(1000));
}

export function iniciarBackendConDatosDeLocalStorage() {
  let bbddLocalStorage = JSON.parse(localStorage.getItem('bbdd'));
  if (bbddLocalStorage) {
    sobreEscribirBBDD(bbddLocalStorage);
  } else {
    localStorage.setItem('bbdd', JSON.stringify(bbdd));
  }
}

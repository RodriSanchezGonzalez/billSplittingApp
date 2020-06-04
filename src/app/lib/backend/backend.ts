import {
  randomDate,
  generateGuid,
  obtenerNumeroDeVecesPorCadaElementoDeUnArray,
} from './helpers.js';
import { bbdd } from './bbdd.js';
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

const obtenerArrayDeObjeto = (obj) => {
  return Object.keys(obj).map((key) => obj[key]);
};

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
  return of(null).pipe(delay(1000));
}

export function crearFactura(facturaACrear) {
  let id = generateGuid();
  bbdd.facturas[id] = {
    id,
    total: facturaACrear.total,
    estaPagada: false,
    tipoDeReparticion: TipoDeReparticionModelo[facturaACrear.tipoDeReparticion],
    tipoDeFacturaId: facturaACrear.tipoDeFacturaId,
    fechaDeCreacion: new Date(),
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
    debugger;
    gestionarSiElPagadorSeraSugerido(
      facturaACrear.creadorId,
      pagador.usuarioId
    );
  });

  return of(bbdd.facturas[id]).pipe(delay(1000));
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
  return of(bbdd.usuarios[id]).pipe(delay(1000));
}

export function login(credenciales) {
  let usuario: UsuarioModelo = { ...bbdd.usuarios[credenciales.id] };
  let token = generateGuid();
  return of(token).pipe(delay(1000));
}

export function obtenerTodaLaBBDD() {
  return of(bbdd).pipe(delay(1000));
}

export function sobreescribirBaseDeDatos(baseDeDatos) {
  let asd = bbdd;
  asd = baseDeDatos;
  return of(asd).pipe(delay(1000));
}

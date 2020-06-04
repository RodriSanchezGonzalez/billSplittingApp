export function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export function generateGuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function obtenerNumeroDeVecesPorCadaElementoDeUnArray(lista) {
  return lista.reduce(
    (a, b) =>
      Object.assign(a, {
        [b]: { id: b, contador: ((a[b] && a[b]["contador"]) || 0) + 1 },
      }),
    {}
  );
}

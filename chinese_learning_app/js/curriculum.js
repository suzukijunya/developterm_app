// ユニットの並び順を、ロードマップ(LEVELS)の順番にそろえる。
// レッスンの解放はこの並び順で進むので、レベルの順に学べるようになる。
(() => {
  const order = LEVELS.flatMap((lv) => lv.unitIds);
  const rank = (u) => {
    const i = order.indexOf(u.id);
    return i < 0 ? order.length : i;
  };
  const sorted = UNITS.slice().sort((a, b) => rank(a) - rank(b));
  UNITS.splice(0, UNITS.length, ...sorted);
})();

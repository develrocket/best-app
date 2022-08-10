
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
export default function renderDate(d) {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString();
  const day = date.getDate().toString();
  const hour = pad(date.getHours(), 2);
  const minute = pad(date.getMinutes(), 2);
  const second = pad(date.getSeconds(), 2);

  return month + '-' + day + '-' + year + ' ' + hour + ':' + minute + ':' + second;
}

export const searchParams = (...params) => {
  let pairs = params.reduce((acc, param) =>
    param[1] ? [...acc, `${param[0]}=${param[1]}`] : acc
    , []);
  if (pairs.length > 0) {
    return `?${pairs.join("&")}`;
  }
  return "";
}
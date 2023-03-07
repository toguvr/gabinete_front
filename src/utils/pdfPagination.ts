export function paginationArray(bigarray: any, size = 20) {
  var arrayOfArrays = [];

  for (var i = 0; i < bigarray.length; i += size) {
    arrayOfArrays.push(bigarray.slice(i, i + size));
  }
  return arrayOfArrays;
}

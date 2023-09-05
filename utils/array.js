function paginateArray(array, page, pageSize) {
  const startIndex = (page - 1) * pageSize;
  return array.slice(startIndex, startIndex + pageSize);
}

export { paginateArray };

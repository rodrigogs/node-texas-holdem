const getCombinations = (set, size) => {
  if (size > set.length || size <= 0) return [];
  if (size === set.length) return [set];

  if (size === 1) {
    const combs = [];
    for (let i = 0; i < set.length; i += 1) {
      combs.push([set[i]]);
    }
    return combs;
  }

  const combs = [];
  for (let i = 0; i < (set.length - size) + 1; i += 1) {
    const head = set.slice(i, i + 1);
    const tailcombs = getCombinations(set.slice(i + 1), size - 1);
    for (let j = 0; j < tailcombs.length; j += 1) {
      combs.push([...head, ...tailcombs[j]]);
    }
  }
  return combs;
};

function* getUniqueCombinations(source, increment, maxSize, strict = false) {
  let i = strict ? maxSize : 1;
  for (;i <= maxSize; i += 1) {
    yield* getCombinations(increment, i, strict).map(arr => [...source, ...arr]);
  }
}

module.exports = {
  getUniqueCombinations,
};

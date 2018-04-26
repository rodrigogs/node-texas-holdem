/* eslint-disable no-restricted-syntax,no-await-in-loop */

Promise.each = async function each(arr, fn) {
  for (const item of arr) await fn(item);
};

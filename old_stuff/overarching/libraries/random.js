function RandNum(upper = 1, lower = 0) {
  return (Math.random() * (upper - lower + 1)) + lower;
}

function RandInt(upper, lower) {
  return Math.floor(RandNum(upper, lower));
}

function RandomSeedParkMiller(seed = 123456) { // doesn't repeat b4 JS dies.
  // https://gist.github.com/blixt/f17b47c62508be59987b
  seed = seed % 2147483647
  return () => {
    seed = seed * 16807 % 2147483647
    return (seed - 1) / 2147483646
  }
}
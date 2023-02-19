const sortBy =
  (field, direction = 'asc') =>
  (a, b) => {
    if (direction === 'asc') {
      return parseInt(a[field]) - parseInt(b[field]);
    }
    return parseInt(b[field]) - parseInt(a[field]);
  };

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export { sortBy, shuffle };

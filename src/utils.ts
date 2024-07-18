// export const lerp = (v0: number, v1: number, t: number) => v0 + (v1 - v0) * t
// export const lerp = (v0: number, v1: number, t: number) => v0 * (1 - t) + v1 * t
export const lerp = (v0: number, v1: number, t: number) => (1 - t) * v0 + t * v1

export const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
export const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
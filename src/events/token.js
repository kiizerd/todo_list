function generateId(string) {
  const result = [];
  string.split('').forEach((char) => {
    result.push(string.charCodeAt(char));
  });

  return result.join('');
}

class Token {
  constructor(event, master) {
    let tokenCounter = 0;
    const idString = generateId(`${event}_${master}`);
    this.id = `${idString} ${tokenCounter += 1}`;
  }
}

export default Token;

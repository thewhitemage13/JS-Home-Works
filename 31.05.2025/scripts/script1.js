class Marker {
  constructor(color, ink = 100) {
    this.color = color;
    this.ink = ink;
  }

  print(text) {
    let output = "";
    for (let char of text) {
      if (this.ink <= 0) break;
      if (char !== " ") {
        if (this.ink >= 0.5) {
          output += char;
          this.ink -= 0.5;
        } else {
          break;
        }
      } else {
        output += char;
      }
    }
    console.log(`%c${output}`, `color: ${this.color}`);
  }
}

class RefillableMarker extends Marker {
  refill(amount = 100) {
    this.ink = Math.min(100, this.ink + amount);
  }
}

const simpleMarker = new Marker("blue", 5);
simpleMarker.print("Hello world!");

const refillable = new RefillableMarker("green", 2);
refillable.print("JavaScript is cool!");
refillable.refill();
refillable.print(" Refilled marker works again!");

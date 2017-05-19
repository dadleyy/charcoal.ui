import Evented from "charcoal/util/evented";

class Manager extends Evented {

  constructor(user) {
    super(...arguments);
    this.user = user;
  }

  get initials() {
    const { name } = this.user;
    const letters = name.split(" ").map(l => l.charAt(0));

    return letters.join("").toUpperCase();
  }

}

export default Manager;

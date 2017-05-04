import Evented from "charcoal/util/evented";

describe("Evented class utility", function() {

  let bag = { };

  function handler() {
    bag.call_count++;
  }

  beforeEach(function() {
    const engine = new Evented();
    const call_count = 0;
    bag = { engine, call_count };
  });

  it("should return a unique id when listener is added", function() {
    const id = bag.engine.on("some-event", handler);
    expect(typeof id).toBe("string");
  });

  describe("with an event listener added", function() {

    beforeEach(function() {
      bag.id = bag.engine.on("some-event", handler);
    });

    it("should return true when removing the id", function() {
      const result = bag.engine.off(bag.id);
      expect(result).toBe(true);
    });

    it("should return false when removing an unknown id", function() {
      const result = bag.engine.off("asdad");
      expect(result).toBe(false);
    });

    it("should have 1 listener", function() {
      const { length } = bag.engine;
      expect(length).toBe(1);
    });

    it("should call our handler when event is triggered", function() {
      bag.engine.trigger("some-event");
      expect(bag.call_count).toBe(1);
    });

    describe("having removed our handler", function() {

      beforeEach(function() {
        bag.engine.off(bag.id);
      });

      it("should NOT call our handler when event is triggered", function() {
        bag.engine.trigger("some-event");
        expect(bag.call_count).toBe(0);
      });

    });

  });

});

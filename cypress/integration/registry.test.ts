import {
  insertModule,
  createModuleUrl,
  getModuleUrl,
  inlineModule,
} from "../../src/bloom";

describe("module ", () => {
  it("can create a module url from a string", () => {
    const moduleUrl = createModuleUrl`export default 'a'`;
    insertModule("app", moduleUrl);
    const module = getModuleUrl("app");
    expect(module).to.equal(moduleUrl);
  });

  it("can import a module", async () => {
    const ns = await import(
      /* webpackIgnore: true */ createModuleUrl`export default 'a'`
    );
    expect(ns).to.be.ok;
    expect(ns.default).to.equal("a");
  });

  it("properly handles non-circular dependencies", async () => {
    insertModule("b", createModuleUrl`export default 'b'`);
    insertModule(
      "a",
      createModuleUrl`import b from '${"b"}'; export default 'a ' + b;`
    );
    const a = await import(/* webpackIgnore: true */ getModuleUrl("a"));
    expect(a).to.be.ok;
    expect(a.default).to.equal("a b");
  });
});

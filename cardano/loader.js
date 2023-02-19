class Loader {
  async load(oldBuilder = false) {
    if (this._wasm) return;
    /**
     * @private
     */
    if (oldBuilder) {
      this._wasm = await import('custom-serialization-lib-browser');
    } else {
      this._wasm = await import('jpg-serialization-lib-browser');
    }
  }

  get Cardano() {
    return this._wasm;
  }
}

export default new Loader();

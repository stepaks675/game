import { useState, useEffect } from "react";
import * as wasm from "./sp1/sp1_wasm_verifier.js";
import wasmFile from "./sp1/sp1_wasm_verifier_bg.wasm?url";
export const VerifierComponent = ({ a, b, c }) => {
  const [isInitialized, setIsInitialized] = useState(true);
  const [result, setResult] = useState(null);
  useEffect(() => {
    const loadWasm = async () => {
      try {
        await wasm.default(wasmFile);

        console.log("WebAssembly success");
        setIsInitialized(true);
      } catch (error) {
        console.error("err:", error);
      }
    };

    loadWasm();
  }, []);

  const fromHexString = (hexString) =>
    Uint8Array.from(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

  const Verify = async () => {
    try {
      const zkpType = "groth16";
      const proof = fromHexString(a);
      const public_inputs = fromHexString(b);
      const vkey_hash = c;

      const view = new DataView(public_inputs.buffer);

      const verifyFunction = wasm.verify_groth16;

      const result = await verifyFunction(proof, public_inputs, vkey_hash);

      alert(result ? "Proof is valid!" : "Proof is shit...");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1>WebAssembly Verifier</h1>
      <button
        onClick={Verify}
        className="text-5xl text-white bg-green-600 cursor-pointer px-5 py-2"
      >
        VERIFY PROOF
      </button>
    </div>
  );
};

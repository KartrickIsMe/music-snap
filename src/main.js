import { registerPlugin } from '@capacitor/core';

const PythonBridge = registerPlugin('PythonBridge');

const btn = document.getElementById("btn");
const out = document.getElementById("output");

btn.onclick = async () => {
  const result = await PythonBridge.greet();
  out.innerText = result.value;
};

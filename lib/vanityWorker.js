// lib/vanityWorker.js
const { parentPort, workerData } = require('worker_threads');
const { generateSigner } = require('@metaplex-foundation/umi');
const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');

const { endpoint, targetPrefix } = workerData; // Receive from index.js
const umi = createUmi(endpoint);

let attempts = 0;
while (true) {
    const mint = generateSigner(umi);
    const mintAddress = mint.publicKey.toString();
    attempts++;
    if (mintAddress.startsWith(targetPrefix)) {
        parentPort.postMessage({
            publicKey: mint.publicKey.toString(),
            secretKey: Array.from(mint.secretKey),
            attempts: attempts
        });
        break;
    }
}
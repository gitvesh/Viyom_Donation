const solc = require('solc');
const fs = require('fs');
const path = require('path');

const contractPath = 'c:/Users/HP/Desktop/Viyom-main/Viyom-main/blockchain/contracts/DonationTransparency.sol';
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'DonationTransparency.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        },
        evmVersion: 'paris'
    }
};

console.log('Compiling...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
    output.errors.forEach(err => {
        console.error(err.formattedMessage);
    });
}

const contract = output.contracts['DonationTransparency.sol']['DonationTransparency'];
const abi = JSON.stringify(contract.abi);
const bin = contract.evm.bytecode.object;

const buildDir = 'c:/Users/HP/Desktop/Viyom-main/Viyom-main/blockchain/build';
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

fs.writeFileSync(path.join(buildDir, 'contracts_DonationTransparency_sol_DonationTransparency.abi'), abi);
fs.writeFileSync(path.join(buildDir, 'contracts_DonationTransparency_sol_DonationTransparency.bin'), bin);

console.log('Success! ABI and BIN saved to ' + buildDir);

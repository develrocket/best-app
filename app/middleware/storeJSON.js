import fs from 'fs';

export function storeJSON(state) {
  fs.writeFileSync('state.json', JSON.stringify(state));
}

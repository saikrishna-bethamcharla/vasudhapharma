const fs = require('fs');
const path = require('path');

function clean(str) {
  return str ? str.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&rarr;/g, '→').replace(/&ndash;/g, '–').trim() : '';
}

function parsePage(filePath, defaultCategory, prefix) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return [];
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const rowRegex = /<div class="api-row([^"]*)"([^>]*)>([\s\S]*?)<\/div>\s*<\/div>/g;
  const rows = [];
  let m;
  let counter = 1;

  while ((m = rowRegex.exec(html)) !== null) {
    const classAttr = m[1];
    const attrs = m[2];
    const content = m[3];
    
    // Name
    const nameMatch = content.match(/<div class="api-cell api-name">\s*<strong>([\s\S]*?)<\/strong>/);
    const name = clean(nameMatch ? nameMatch[1] : '');
    if (!name) continue;

    // Cells
    const cellMatches = [...content.matchAll(/<div class="api-cell">([\s\S]*?)<\/div>/g)].map(c => clean(c[1]));
    
    // Details
    const detailGrid = {};
    const dMatches = [...content.matchAll(/<div><span class="adl">([\s\S]*?)<\/span><span class="adv">([\s\S]*?)<\/span><\/div>/g)];
    dMatches.forEach(dm => {
      detailGrid[clean(dm[1]).toLowerCase()] = clean(dm[2]);
    });

    // ID
    const idMatch = attrs.match(/id="([^"]+)"/);
    const numStr = String(counter).padStart(3, '0');
    const id = idMatch ? idMatch[1] : `${prefix}-${numStr}`;
    counter++;

    let cas = detailGrid['cas no.'] || '';
    let spec = detailGrid['specifications'] || '';
    let dmf = detailGrid['regulatory status'] || detailGrid['dmf status'] || detailGrid['filings'] || '';
    let therapeutic = detailGrid['therapeutic category'] || detailGrid['therapeutic use'] || '';
    let intermediate = detailGrid['intermediate'] || '';
    let comp = detailGrid['composition'] || '';
    let type = detailGrid['type'] || '';
    let code = detailGrid['code'] || '';

    // Fallbacks from cells
    if (!cas && cellMatches.length >= 2) {
      cellMatches.forEach(c => {
        if (/^\d{2,7}-\d{2}-\d$/.test(c)) cas = c;
      });
    }

    if (defaultCategory === 'APIs') {
      if (!spec && cellMatches[0]) spec = cellMatches[0];
      if (!cas && cellMatches[1]) cas = cellMatches[1];
      if (!dmf && cellMatches[2]) dmf = cellMatches[2];
      if (!therapeutic && cellMatches[3]) therapeutic = cellMatches[3];
    } else if (defaultCategory === 'Intermediates') {
      if (!intermediate && cellMatches[0]) intermediate = cellMatches[0];
      if (!cas && cellMatches[1]) cas = cellMatches[1];
      if (!therapeutic && cellMatches[2]) therapeutic = cellMatches[2];
      if (!spec) spec = 'In-House Standard';
    } else if (defaultCategory === 'Pellets') {
      if (!type && cellMatches[0]) type = cellMatches[0];
      if (!comp && cellMatches[1]) comp = cellMatches[1];
      if (!cas && cellMatches[2]) cas = cellMatches[2];
      if (!therapeutic && cellMatches[3]) therapeutic = cellMatches[3];
      if (!spec) spec = 'IP / USP / BP / In-House';
      if (!dmf) dmf = 'CEP / USDMF / WHO-GMP Available';
    } else if (defaultCategory === 'Piperidone Derivatives') {
      if (!code && cellMatches[0]) code = cellMatches[0];
      if (!cas && cellMatches[1]) cas = cellMatches[1];
      if (!spec) spec = 'High Purity In-House';
      if (!therapeutic) therapeutic = 'Intermediate Derivative';
    } else if (defaultCategory === 'Under Development') {
      if (!spec && cellMatches[0]) spec = cellMatches[0];
      if (!cas && cellMatches[1]) cas = cellMatches[1];
      if (!dmf && cellMatches[2]) dmf = cellMatches[2];
      if (!therapeutic && cellMatches[3]) therapeutic = cellMatches[3];
    }

    rows.push({
      id,
      name,
      category: defaultCategory,
      cas_no: cas,
      specifications: spec,
      dmf_status: dmf,
      therapeutic: therapeutic,
      intermediate_name: intermediate,
      composition: comp,
      pellet_type: type,
      product_code: code,
      status: defaultCategory === 'Under Development' ? 'pipeline' : 'active',
      public_page: defaultCategory === 'APIs' ? 'apis.html'
                 : defaultCategory === 'Intermediates' ? 'intermediates.html'
                 : defaultCategory === 'Pellets' ? 'pellets.html'
                 : defaultCategory === 'Piperidone Derivatives' ? 'piperidone-derivatives.html'
                 : defaultCategory === 'Under Development' ? 'under-development.html'
                 : 'products.html',
      note: '',
      updated_at: new Date().toISOString()
    });
  }
  return rows;
}

const rootDir = path.resolve(__dirname, '..', '..');
const apis = parsePage(path.join(rootDir, 'apis.html'), 'APIs', 'PR-API');
const ints = parsePage(path.join(rootDir, 'intermediates.html'), 'Intermediates', 'PR-INT');
const pellets = parsePage(path.join(rootDir, 'pellets.html'), 'Pellets', 'PR-PEL');
const pips = parsePage(path.join(rootDir, 'piperidone-derivatives.html'), 'Piperidone Derivatives', 'PR-PIP');
const udev = parsePage(path.join(rootDir, 'under-development.html'), 'Under Development', 'PR-DEV');

const allItems = [...apis, ...ints, ...pellets, ...pips, ...udev];

const deskData = {
  updated: new Date().toISOString().replace('T', ' ').substring(0, 16),
  items: allItems
};

// Write to staff/data/marketing.json
const marketingJsonPath = path.join(rootDir, 'staff', 'data', 'marketing.json');
fs.writeFileSync(marketingJsonPath, JSON.stringify(deskData, null, 2), 'utf8');

// Write to assets/data/products-catalog.json
const publicJsonPath = path.join(rootDir, 'assets', 'data', 'products-catalog.json');
fs.writeFileSync(publicJsonPath, JSON.stringify(deskData, null, 2), 'utf8');

console.log(`Successfully seeded ${allItems.length} products:`);
console.log(`- APIs: ${apis.length}`);
console.log(`- Intermediates: ${ints.length}`);
console.log(`- Pellets: ${pellets.length}`);
console.log(`- Piperidone Derivatives: ${pips.length}`);
console.log(`- Under Development: ${udev.length}`);
console.log(`Saved to: ${marketingJsonPath}`);
console.log(`Saved to: ${publicJsonPath}`);

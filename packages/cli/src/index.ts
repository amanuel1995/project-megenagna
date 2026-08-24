#!/usr/bin/env node
/**
 * Project Megenagna CLI
 */

import fs from 'node:fs';
import path from 'node:path';
import { fromCoordinates, parseAddress, decode, toFaydaPayload, ETHIOPIA_REGIONS } from '@megenagna/core';
import { generatePlaqueSvg } from '@megenagna/plaque';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
Project Megenagna (መገናኛ) - CLI Tool
Open-Source Addressing & Spatial Grid for Ethiopia

USAGE:
  megenagna <command> [arguments] [options]

COMMANDS:
  encode <lat> <lng>             Generate Ethiopian National Address & Plus Code
  decode <code>                  Decode Plus Code or Megenagna address into coordinates
  parse <address-string>         Parse formatted address string (e.g. ET-AA-LK-W03-8FW4+9X)
  plaque <lat> <lng>             Generate SVG door plaque
  fayda <lat> <lng>              Output JSON schema ready for Fayda National ID
  regions                        List Ethiopian regions & sub-cities

OPTIONS:
  --region, -r <code/name>       Specify region code (e.g. AA, OR, DD, AM)
  --subcity, -s <code/name>      Specify sub-city / zone (e.g. LK, BO, KR)
  --woreda, -w <number>          Specify woreda number (e.g. 03)
  --house, -h <number>           Specify house number
  --theme <name>                 Plaque theme: civic-blue, brass, modern-dark, clean-white
  --output, -o <filepath>        Output file for plaque SVG (default: plaque.svg)

EXAMPLES:
  megenagna encode 9.0203 38.8020 --woreda 03 --house 104
  megenagna parse ET-AA-LK-W03-8FW4+9X
  megenagna plaque 9.0108 38.7618 --output meskel_square_plaque.svg
  megenagna fayda 8.9778 38.7993
`);
}

function getOption(flag1: string, flag2?: string): string | undefined {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag1 || (flag2 && args[i] === flag2)) {
      return args[i + 1];
    }
  }
  return undefined;
}

async function main() {
  const cmd = args[0]?.toLowerCase();

  if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') {
    printHelp();
    process.exit(0);
  }

  if (cmd === 'regions') {
    console.log('\nEthiopian Administrative Regions & Sub-cities:\n');
    for (const [code, reg] of Object.entries(ETHIOPIA_REGIONS)) {
      console.log(`[${code}] ${reg.nameEn} (${reg.nameAm})`);
      if (reg.subcitiesOrZones) {
        for (const [sCode, sub] of Object.entries(reg.subcitiesOrZones)) {
          console.log(`     └─ [${sCode}] ${sub.nameEn} (${sub.nameAm})`);
        }
      }
    }
    console.log();
    return;
  }

  if (cmd === 'encode') {
    const lat = parseFloat(args[1]);
    const lng = parseFloat(args[2]);

    if (isNaN(lat) || isNaN(lng)) {
      console.error('Error: Please provide valid latitude and longitude numbers.');
      process.exit(1);
    }

    const regionCode = getOption('--region', '-r');
    const subDivisionCode = getOption('--subcity', '-s');
    const woreda = getOption('--woreda', '-w');
    const houseNumber = getOption('--house', '-h');

    const address = fromCoordinates(lat, lng, {
      regionCode,
      subDivisionCode,
      woreda,
      houseNumber
    });

    console.log('\n===========================================');
    console.log('       MEGENAGNA ADDRESS DETAILS          ');
    console.log('===========================================');
    console.log(`Full Digital Address : ${address.formatted}`);
    console.log(`Short Plus Code      : ${address.shortCode}`);
    console.log(`Full Plus Code       : ${address.fullCode}`);
    console.log(`Region               : ${address.regionNameEn} (${address.regionNameAm}) [${address.regionCode}]`);
    if (address.subDivisionNameEn) {
      console.log(`Sub-city / Zone      : ${address.subDivisionNameEn} (${address.subDivisionNameAm})`);
    }
    if (address.woreda) console.log(`Woreda               : ${address.woreda}`);
    if (address.houseNumber) console.log(`House Number         : ${address.houseNumber}`);
    console.log(`Latitude / Longitude : ${address.latitude.toFixed(6)}, ${address.longitude.toFixed(6)}`);
    console.log('===========================================\n');
    return;
  }

  if (cmd === 'parse') {
    const input = args[1];
    if (!input) {
      console.error('Error: Please provide an address string to parse.');
      process.exit(1);
    }

    try {
      const address = parseAddress(input);
      console.log(JSON.stringify(address, null, 2));
    } catch (err: any) {
      console.error(`Error parsing address: ${err.message}`);
      process.exit(1);
    }
    return;
  }

  if (cmd === 'decode') {
    const code = args[1];
    if (!code) {
      console.error('Error: Please provide a Plus Code or full address to decode.');
      process.exit(1);
    }
    try {
      const address = parseAddress(code);
      console.log('\nDecoded Location:');
      console.log(`  Latitude  : ${address.latitude}`);
      console.log(`  Longitude : ${address.longitude}`);
      console.log(`  Full Code : ${address.fullCode}`);
      console.log(`  Region    : ${address.regionNameEn}`);
      console.log();
    } catch (err: any) {
      console.error(`Error decoding: ${err.message}`);
      process.exit(1);
    }
    return;
  }

  if (cmd === 'fayda') {
    const lat = parseFloat(args[1]);
    const lng = parseFloat(args[2]);
    if (isNaN(lat) || isNaN(lng)) {
      console.error('Error: Please provide valid latitude and longitude numbers.');
      process.exit(1);
    }
    const regionCode = getOption('--region', '-r');
    const subDivisionCode = getOption('--subcity', '-s');
    const woreda = getOption('--woreda', '-w');
    const houseNumber = getOption('--house', '-h');

    const address = fromCoordinates(lat, lng, { regionCode, subDivisionCode, woreda, houseNumber });
    const payload = toFaydaPayload(address);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (cmd === 'plaque') {
    const lat = parseFloat(args[1]);
    const lng = parseFloat(args[2]);
    if (isNaN(lat) || isNaN(lng)) {
      console.error('Error: Please provide valid latitude and longitude numbers.');
      process.exit(1);
    }
    const regionCode = getOption('--region', '-r');
    const subDivisionCode = getOption('--subcity', '-s');
    const woreda = getOption('--woreda', '-w');
    const houseNumber = getOption('--house', '-h');
    const theme = (getOption('--theme') || 'civic-blue') as any;
    const outputPath = getOption('--output', '-o') || 'plaque.svg';

    const address = fromCoordinates(lat, lng, { regionCode, subDivisionCode, woreda, houseNumber });
    const svg = await generatePlaqueSvg(address, { theme });

    fs.writeFileSync(path.resolve(outputPath), svg, 'utf-8');
    console.log(`\nSuccessfully generated plaque SVG: ${outputPath}`);
    console.log(`Digital Address: ${address.formatted}\n`);
    return;
  }

  console.error(`Unknown command: ${cmd}`);
  printHelp();
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

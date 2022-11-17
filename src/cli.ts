import arg from 'arg';
import { EnrichStandardWOC } from "./enrich-standard";
import { ExtendedToStandard } from "./extended-to-standard";
import { StandardToExtended } from "./standard-to-extended";

const args = arg(
  {
    '--help': Boolean,
    '--to-standard': Boolean,
    '--to-extended': Boolean,
    '--enrich-standard': Boolean,
  },
);

if (args['--help']) {
  console.log("Usage: bitcoin-ef --to-standard <hex> | --to-extended <hex> <JSON outpoints string> | [--enrich-standard] <hex>");
  process.exit(0);
}

if (args._.length < 1) {
  console.log("bitcoin-ef needs the tx hex as input");
} else {
  const tx = args._[0];
  try {
    if (args['--to-standard']) {
      console.log("\nStandard Transaction:\n" + ExtendedToStandard(tx), "\n");
    } else if (args['--to-extended']) {
      const previousOuts = JSON.parse(args._[1]);
      if (previousOuts.length > 0) {
        console.log("\nExtended Transaction:\n" + StandardToExtended(tx, previousOuts), "\n");
      } else {
        throw new Error('previousOuts must be an array of at least one element');
      }
    } else {
      (async () => {
        console.log("\nExtended Transaction:\n" + await EnrichStandardWOC(tx), "\n");
      })().catch(e => {
        console.error("ERROR:", e.message);
      });
    }
  } catch (e: any) {
    console.error("ERROR:", e.message);
  }
}

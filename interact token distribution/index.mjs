import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

const stdlib = loadStdlib({ REACH_NO_WARN: 'Y' });
const sbal = stdlib.parseCurrency(100);
const accAlice = await stdlib.newTestAccount(sbal);
const fmt = (x) => stdlib.formatCurrency(x, 4);
const deadline = stdlib.connector === 'CFX' ? 500 : 250;

const ctcAlice = accAlice.contract(backend);
//console.log(ctcD);

const users = await stdlib.newTestAccounts(3, sbal);
const ctcWho = (whoi) =>
  users[whoi].contract(backend, ctcAlice.getInfo());

const tId = await stdlib.launchToken(accAlice, "YOUTH TOKEN", "YT");



if ( stdlib.connector === 'ETH' || stdlib.connector === 'CFX' ) {
  const gasLimit = 5000000;
  accAlice.setGasLimit(gasLimit);
  users[0].setGasLimit(gasLimit);
  users[1].setGasLimit(gasLimit);
  users[2].setGasLimit(gasLimit);

} else if ( stdlib.connector == 'ALGO' ) {
  console.log(`Demonstrating need to opt-in for non network token`);
  console.log(`Opt-ing in on ALGO`);
  await users[0].tokenAccept(tId.id);
  await users[1].tokenAccept(tId.id);
  await users[2].tokenAccept(tId.id);
 
}

await tId.mint(accAlice, 100000000);


const willError = async (f, whoi) => {
  const who = users[whoi];  
  let e;
  try {
    await f();
    e = false;
  } catch (te) {
    e = te;
  }
  if ( e === false ) {
    throw Error(`Expected to error, but didn't`);
  }
  console.log(stdlib.formatAddress(who), ' you didnt interact with the api early'  );
};

const getAdd = async (whoi) => {
  const who = users[whoi];
  const ctc = ctcWho(whoi);
  await ctc.apis.User.putAdd();
  console.log('Adding', stdlib.formatAddress(who), ' to the whitelist.');
};
const Claim = async (whoi) => {
  const who = users[whoi];
  const ctc = ctcWho(whoi);
  const y = await ctc.apis.Claim.seeStatus();
  //console.log(y)
 if (y) console.log('Whitelist for', stdlib.formatAddress(who), ' was successful ');
  
  else console.log('Whitelist for', stdlib.formatAddress(who), ' was not successful ');
}
const see = async(whoi) => {
  const who = users[whoi];
  const ctc = ctcWho(whoi);
  await ctc.apis.see.seeBalance();
  const w = fmt(await stdlib.balanceOf(who, tId.id));
  console.log(stdlib.formatAddress(who),' balance is ' + w, tId.sym);
  
}

const seeD = async(ctc) => {//displays token properties
  await ctc.apis.seeD.seeBal();
  const w = fmt(await stdlib.balanceOf(accAlice, tId.id));
  console.log('Deployer\s balance after distribution of tokens is ' + w, tId.sym);
  const mdA = await accAlice.tokenMetadata(tId.id);
  console.log('Token Name: ',mdA.name.toString())
  console.log('Token Symbol: ',mdA.symbol.toString())
  console.log('Supply: ',mdA.supply.toString())
  console.log('Decimals: ',mdA.decimals.toString())
  console.log('Whitelist Selection and Distribution is Complete\n THANK YOU FOR YOUR TIME ')

}

await Promise.all([
  backend.Alice(ctcAlice, {
    getToken : () => {
        //console.log(IToken.name.toString())
        return tId.id;
    },

  }),

await getAdd(0),//interacting with the api first
await willError(() => getAdd(1),1),//To error because the set has been filled already
await Claim(0),
await Claim(1),
await Claim(2),
await see(0),//see balances
await see(1),
await seeD(ctcAlice),//deployer sees balance
process.exit()
]);

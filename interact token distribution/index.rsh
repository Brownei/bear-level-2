"reach 0.1";

export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    getToken: Fun([], Token),

    
  });

  const User = API('User', {
    putAdd: Fun([], Bool ),
  });
  const Claim = API('Claim', {
    seeStatus: Fun([], Bool),
  });
  const see = API('see', {
    seeBalance: Fun([], Bool),
  });
  const seeD = API('seeD', {
    seeBal: Fun([], Bool),

  })
  init();

 Alice.only(() => {
    const tId = declassify(interact.getToken());
   
  });
  
  Alice.publish(tId);
  commit();
  
  const IAmt = 10000000000;
  Alice.pay([[IAmt, tId]])
  
   
  const deadlineBlock = relativeTime(100);
 
  const Whitelist = new Set();

  const [keepGoing] =
    parallelReduce([0])
    .invariant(balance() == balance())
 
    .while( keepGoing <= 1 )
    .api_(User.putAdd, () => {

      check( this != Alice, "you are the user");
      return [ 0, (k) => {
        k(true);
        Whitelist.insert(this);
        
        return [ keepGoing + 2];
      }];
    })
    const [keepGoing2] = 
      parallelReduce([0])
      .invariant(balance() ==  balance() )
      .while(keepGoing2 == 0)
      .api_(Claim.seeStatus, () => {
        check( this != Alice, "King");
  
        return [ 0, (k) => {
          k(Whitelist.member(this));
          if(Whitelist.member(this)){

            transfer(balance(tId)/5, tId).to(this);
            return [ keepGoing2];
          }
          else return [ keepGoing2];
          }];
      })
      .api_(see.seeBalance, () => {
        return [ 0, (k) => {
          k(true);
          return [ keepGoing2];
          }];
      })
      .api_(seeD.seeBal, () => {
        check( this == Alice, "wrong");
        return [ 0, (k) => {
          k(true);
          return [ keepGoing2];
          }];
      });
  transfer(balance()).to(Alice);
  transfer(balance(tId) ,tId).to(Alice);
  
  
  commit();

  exit();
});

import { CustomABO } from "./custom";
import { flowchart } from "./mermaid-flowchart";

function pbcopy(data: string) {
    // fs.writeFile("./amway.mmd", data, { flag: 'w' }, function (err) {
    //     if (err) throw err;
    //     console.log("Saved!");
    // });
    const proc = require('child_process').spawn('pbcopy');
    proc.stdin.write(data); proc.stdin.end();
}

const first = new CustomABO(null, 'first').buy(5000);

const front1 = first.sponsor("front1");
    front1.member().buy(5000);
    const leader2 = front1.sponsor();
        leader2.sponsor();
    const leader3 = front1.sponsor();
        const leader4 = leader3.sponsor().buy(2500);
            leader4.sponsor().buy(2500);
            leader4.sponsor();
    const leader5 = front1.sponsor();
        leader5.sponsor();
        leader5.sponsor().buy(4500);

const front2 = first.sponsor("front2");

const front3 = first.sponsor("front3").sponsor().buy(5000);
    front3.member("dad");
    front3.member("grandma").buy(2000);
    front3.member("aunt").buy(250);
    front3.member("mom").buy(250);

// this generate an organization that everyone have new one abo every month and got 1000 pv each 
// first.buy(1000);
// const nested_sponsor = (fls: CustomABO[]) => {
//     for(const fl of fls) {
//         nested_sponsor(fl.fls);
//         const dl_fl = fl.sponsor();
//         dl_fl.buy(1000);
//     }
// }
// const monthPass = 8
// for(let month = 1; month <= monthPass; month++) {
//     nested_sponsor(first.fls);
//     const fl = first.sponsor();
//     fl.buy(1000);
// }


pbcopy(flowchart(first));
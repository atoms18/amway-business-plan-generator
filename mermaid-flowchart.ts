
import { BuzzoluteABO } from "./custom";
import { Member } from "./internal";

export function flowchart(me: BuzzoluteABO, layer=Infinity) {
    const display = (abo: BuzzoluteABO) => {
        if(abo instanceof Member) {
            return `${abo.getName()}
                member
                ${abo.getPPV()}ppv
                ${abo.getPV()}pv
            `;
        } else {
            return `${abo.getName()}
                ${abo.getDiscount()}%
                ${abo.getPPV()}ppv
                ${abo.getGPV()}gpv
                ${abo.getPV()}pv
                ${abo.isTurnPro() ? "turn pro":""}
                ${abo.isTurnProPlus() ? "turn pro plus":""}
                ii ${abo.getIncome().getDiscount().toFixed(2)}
                iii ${abo.getIncome().getRuby().toFixed(2)}
                iv ${abo.getIncome().getFranchise().toFixed(2)}
                T ${Object.values(abo.getIncome()).reduce((acc, cur) => acc + cur, 0).toFixed(2)}
            `;
        }
    }
    let flowchart = "flowchart\n";
    flowchart += `me[${display(me)}]\n`;
    const nested_flowchart = (fls: BuzzoluteABO[], layer: number, ulname?: string) => {
        if(layer >= 2) {
            layer--;
            for(const dl_fl of fls) {
                flowchart += `${ulname} --> ${dl_fl.getName()}[${display(dl_fl)}]\n`;
                nested_flowchart(dl_fl.fls, layer, dl_fl.getName());
            }
        }
    }
    if(layer > 0) {
        for(const fl of me.fls) {
            flowchart += `me --> ${fl.getName()}[${display(fl)}]\n`;
            if(layer > 1) nested_flowchart(fl.fls, layer, fl.getName());
        }
    }
    return flowchart;
}
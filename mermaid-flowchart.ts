
import { BuzzoluteABO } from "./custom";
import { ABO, Member } from "./internal";

export function flowchart(me: ABO | undefined, { layer=Infinity, silverOnly=false }={}) {
    if(!me) return;
    const display = (abo: ABO) => {
        if(abo instanceof Member) {
            return `member
${abo.getName()}
${abo.context}
${abo.getPPV()}ppv
${abo.getPV()}pv
`;
        } else {
            return `abo
${abo.getName()}
${abo.context}
${abo.getDiscount()}% ${abo.isSilverProducer ? "silver producer":""}
${abo.getPPV()}ppv
${abo.getGPV()}gpv
${abo.getPV()}pv
${abo instanceof BuzzoluteABO && abo.isTurnPro() ? "turn pro":""}
${abo instanceof BuzzoluteABO && abo.isTurnProPlus() ? "turn pro plus":""}
ii ${abo.getIncome().getDiscount().toFixed(2)}
iii ${abo.getIncome().getRuby().toFixed(2)}
iv ${abo.getIncome().getFranchise().toFixed(2)}
v ${abo.getIncome().getPearl().toFixed(2)}
T ${Object.values(abo.getIncome()).reduce((acc, cur) => acc + cur, 0).toFixed(2)}
`;
        }
    }
    let flowchart = "flowchart\n";
    flowchart += `me[${display(me)}]\n`;
    const nested_flowchart = (fls: ABO[], layer: number, uid?: string) => {
        if(layer >= 2) {
            layer--;
            for(const dl_fl of fls) {
                let show = true;
                if(silverOnly && dl_fl.getDiscount() != 21) {
                    show = false;
                }
                if(show) flowchart += `${uid} --> ${dl_fl.UID}[${display(dl_fl)}]\n`;
                nested_flowchart(dl_fl.fls, layer, dl_fl.UID);
            }
        }
    }
    if(layer > 0) {
        for(const fl of me.fls) {
            let show = true;
            if(silverOnly && fl.getDiscount() != 21) {
                show = false;
            }
            if(show) flowchart += `me --> ${fl.UID}[${display(fl)}]\n`;
            if(layer > 1) nested_flowchart(fl.fls, layer, fl.UID);
        }
    }
    return flowchart;
}
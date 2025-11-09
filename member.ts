
import { ABO } from "./internal";

export class Member extends ABO {
    override buy(volume: number) {
        const newPV = this.getPV() + volume;
        // if(this.checkIfReachSilverProducer(newPV)) {
        //     this.franchiseBuy(volume, dl);
        //     return this;
        // }

        this.setPPV(this.getPPV() + volume);
        // this.gpv += volume;
        this.setPV(newPV);
        // this.discount = DiscountCalculate(newPV);

        // this.income.setDiscountIncome(this.pv, this.fls);
        // this.income.setRubyIncome(this.gpv);

        if(this.ul) this.ul.buy(volume, this);
        return this;
    }
}
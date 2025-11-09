
import { ABO } from "./internal";

export class Member extends ABO {
    override buy(volume: number, personal=true) {
        super.buy(volume, personal);
        this.setFranchise(false);
        this.setGPV(0);
        this.setDiscount(0);
        this.income.setZero();
        return this;
    }
}

import { ABO } from "./internal";

export class Member extends ABO {
    override buy(volume: number, personal=true) {
        super.buy(volume, personal);
        this.isFranchise = false;
        this.gpv = 0;
        this.discount = 0;
        this.income.setZero();
        return this;
    }
}
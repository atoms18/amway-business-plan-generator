
import { Income, Member } from "./internal";
import { DiscountCalculate } from "./util";

export class ABO {
    public fls: ABO[] = [];
    public get dls(): ABO[] {
        const dl: ABO[] = [];
        for(const fl of this.fls) {
            dl.push(fl);
            dl.push(...fl.dls);
        }
        return dl;
    }

    private income = new Income();

    private isFranchise = false;

    private ppv = 0;
    private gpv = 0;
    private pv = 0;
    private discount = 0;

    getName() {
        return this.name;
    }
    getIncome() {
        return this.income;
    }
    getPPV() {
        return this.ppv;
    }
    getGPV() {
        return this.gpv;
    }
    getPV() {
        return this.pv;
    }
    getDiscount() {
        return this.discount;
    }
    setPPV(pv: number) {
        this.ppv = pv;
    }
    setPV(pv: number) {
        this.pv = pv;
    }

    constructor(protected ul: ABO | null, protected name?: string) {
        if(this.name) {
            if(this.ul) this.name = `${this.ul.name}_${this.name}`;
        } else {
            if(this.ul) this.name = `${this.ul.name}_${this.ul.fls.length + 1}`;
        }
    }

    sponsor(name?: string): ABO {
        const newABO = new ABO(this, name);
        this.fls.push(newABO);
        return newABO;
    }

    member(name?: string): Member {
        const newMember = new Member(this, name);
        this.fls.push(newMember);
        return newMember;
    }

    buy(volume: number): ABO;
    buy(volume: number, dl: ABO | null): ABO;
    buy(volume: number, dl: ABO | null=null): ABO {
        const newPV = this.pv + volume;
        if(this.checkIfReachSilverProducer(newPV)) {
            this.franchiseBuy(volume, dl);
            return this;
        }

        if(!dl) this.ppv += volume;
        this.gpv += volume;
        this.pv = newPV;
        this.discount = DiscountCalculate(newPV);

        this.income.setDiscountIncome(this.pv, this.fls);
        this.income.setRubyIncome(this.gpv);

        if(this.ul) this.ul.buy(volume, this);
        return this;
    }
    private franchiseBuy(volume: number, dl: ABO | null=null): void {
        if(dl) {
            if(dl?.isFranchise === false) {
                this.gpv += volume;
            }
        } else {
            this.ppv += volume;
            this.gpv += volume;
        }
        this.pv += volume;
        this.discount = DiscountCalculate(this.pv);

        this.income.setDiscountIncome(this.pv, this.fls);
        this.income.setRubyIncome(this.gpv);
        this.income.setFranchiseIncome(this.gpv, this.fls);

        if(this.ul) this.ul.buy(volume, this);
    }
    private checkIfReachSilverProducer(pv: number): boolean {
        if(this.isFranchise) {
            return true;
        }
        if(DiscountCalculate(pv) == Income.SILVER_PRODUCER_PERCENT) {
            this.isFranchise = true;

            if(this.ul) {
                this.ul.gpv -= this.pv;
            }
            return true;
        }
        return false;
    }
}
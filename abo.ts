
import { Income, Member } from "./internal";
import { DiscountCalculate } from "./util";

export class ABO {
    public fls: ABO[] = [];
    get dls(): ABO[] {
        const dl: ABO[] = [];
        for(const fl of this.fls) {
            dl.push(fl);
            dl.push(...fl.dls);
        }
        return dl;
    }

    protected isFranchise = false;
    protected income = new Income();

    private ppv = 0;
    protected gpv = 0;
    private pv = 0;
    protected discount = 0;

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

    constructor(protected ul: ABO | null, protected name?: string) {
        if(!this.name && this.ul) {
            this.name = `${this.ul.name}_${this.ul.fls.length + 1}`;
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
    buy(volume: number, personal: boolean): ABO;
    buy(volume: number, personal=true): ABO {

        const newPV = this.pv + volume;
        const newDiscount = DiscountCalculate(newPV);
        if(newDiscount == 21) this.isFranchise = true;
        if(this.isFranchise) return this.franchiseBuy(volume, true);

        if(personal) {
            this.ppv += volume;
        }
        this.gpv += volume;
        this.pv = newPV;
        this.discount = newDiscount;

        this.income.setDiscountIncome(this.pv, this.fls);
        this.income.setRubyIncome(this.gpv);

        if(this.ul) this.ul.buy(volume, false);
        return this;
    }
    private franchiseBuy(volume: number, personal=true): ABO {
        if(personal) {
            this.ppv += volume;
            this.gpv += volume;
        }
        this.pv += volume;
        this.discount = DiscountCalculate(this.pv);

        this.income.setDiscountIncome(this.pv, this.fls);
        this.income.setRubyIncome(this.gpv);
        this.income.setFranchiseIncome(this.gpv, this.fls);

        if(this.ul) this.ul.franchiseBuy(volume, false);
        return this;
    }
}
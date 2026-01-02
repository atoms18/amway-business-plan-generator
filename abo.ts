
import { v4 as uuidv4 } from "uuid";
import { Income, Member } from "./internal";
import { DiscountCalculate } from "./util";

export class ABO {
    public context: string = "";
    public setContext(context: string): ABO {
        this.context = context;
        return this;
    }

    public UID = uuidv4();

    public fls: ABO[] = [];
    public get dls(): ABO[] {
        const dl: ABO[] = [];
        for(const fl of this.fls) {
            dl.push(fl);
            dl.push(...fl.dls);
        }
        return dl;
    }

    public get isBreakAway() {
        return this.getDiscount() == Income.BREAK_AWAY_DISCOUNT_PERCENT;
    }
    public get isSilverProducer(): boolean {
        const flBreakAway = this.fls.filter(fl => fl.isBreakAway);
        return this.gpv >= Income.BREAK_AWAY_VOLUME
                || (this.gpv >= Income.MINIMUM_ฺBALANCE_VOLUME && flBreakAway.length == 1)
                || (flBreakAway.length >= 2);
    }
    public get isPearl(): boolean {
        return this.fls.filter(fl => fl.isBreakAway).length >= 3;
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
            if(this.ul) this.name = `${this.name}`;
        } else {
            if(this.ul) this.name = `${this.ul.fls.length + 1}`;
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
        if(this.checkIfThisFranchise(newPV)) {
            this.franchiseBuy(volume, dl);
            return this;
        }

        if(!dl) this.ppv += volume;
        this.gpv += volume;
        this.pv = newPV;
        this.discount = DiscountCalculate(newPV);

        this.income.calculateDiscountIncome(this.pv, this.fls);
        this.income.calculateRubyIncome(this.gpv);

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

        this.income.calculateDiscountIncome(this.pv, this.fls);
        this.income.calculateRubyIncome(this.gpv);
        if(this.isSilverProducer) this.income.calculateFranchiseIncome(this.gpv, this.fls);
        if(this.isPearl) this.income.calculatePearlIncome(this.fls);

        if(this.ul) this.ul.buy(volume, this);
    }
    private checkIfThisFranchise(pv: number): boolean {
        if(this.isFranchise) {
            return true;
        }
        if(DiscountCalculate(pv) == Income.BREAK_AWAY_DISCOUNT_PERCENT) {
            this.isFranchise = true;

            if(this.ul) {
                this.ul.gpv -= this.pv;
            }
            return true;
        }
        return false;
    }
}
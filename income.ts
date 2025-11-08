
import { ABO } from "./internal";
import { DiscountCalculate } from "./util";

export class Income {
    static PVBV_RATIO = 3.23;
    
    constructor(
        private discount = 0,
        private franchise = 0,
        private ruby = 0
    ) { }

    public getDiscount() {
        return this.discount;
    }
    public getFranchise() {
        return this.franchise;
    }
    public getRuby() {
        return this.ruby;
    }

    public setZero() {
        this.discount = 0;
        this.franchise = 0;
        this.ruby = 0;
    }

    public setDiscountIncome(pv: number, fls: ABO[]) {
        this.discount = this.discountIncomeCalculate(DiscountCalculate(pv), pv);
        this.discount -= fls.reduce((dl_sum, dl) => dl_sum + this.discountIncomeCalculate(dl.getDiscount(), dl.getPV()), 0);
    }
    public setFranchiseIncome(gpv: number, fls: ABO[]) {
        const fl21percent = fls.filter(fl => fl.getDiscount() == 21);
        if(gpv >= 55000 || fl21percent.length >= 2) {
            let garantee = 150_000 - gpv;
            garantee = garantee < 0 ? 0:garantee;
            const franchiseVolume = fls.reduce((vol, fl) => {
                if(fl.getDiscount() == 21) vol += fl.getPV();
                return vol;
            }, 0);
            this.franchise = this.discountIncomeCalculate(6, franchiseVolume - garantee);
        }
    }
    public setRubyIncome(gpv: number) {
        if(gpv > 300_000) this.ruby = 0.02 * gpv * Income.PVBV_RATIO;
    }

    private discountIncomeCalculate(discount: number, pv: number) {
        return (discount / 100) * pv * Income.PVBV_RATIO;
    }
}
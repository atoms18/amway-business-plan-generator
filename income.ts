
import { ABO } from "./internal";
import { DiscountCalculate } from "./util";

export class Income {
    private static PVBV_RATIO = 3.23;

    public static SILVER_PRODUCER_PERCENT = 21;
    private static FRANCHISE_INCOME_PERCENT = 6;

    private static MINIMUM_ฺฺBALANCE_VOLUME = 55_000;
    private static GARANTEE_VOLUME = 150_000;

    private static RUBY_VOLUME = 300_000;
    private static RUBY_INCOME_PERCENT = 2;
    
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
        const flsilver = fls.filter(fl => fl.getDiscount() == Income.SILVER_PRODUCER_PERCENT);
        if(gpv >= Income.MINIMUM_ฺฺBALANCE_VOLUME || flsilver.length >= 2) {
            let garantee = Income.GARANTEE_VOLUME - gpv;
            garantee = garantee < 0 ? 0:garantee;
            const franchiseVolume = fls.reduce((vol, fl) => {
                if(fl.getDiscount() == Income.SILVER_PRODUCER_PERCENT) vol += fl.getPV();
                return vol;
            }, 0);
            this.franchise = this.discountIncomeCalculate(Income.FRANCHISE_INCOME_PERCENT, franchiseVolume - garantee);
        }
    }
    public setRubyIncome(gpv: number) {
        if(gpv > Income.RUBY_VOLUME) this.ruby = this.discountIncomeCalculate(Income.RUBY_INCOME_PERCENT, gpv)
    }

    private discountIncomeCalculate(discount: number, pv: number) {
        return (discount / 100) * pv * Income.PVBV_RATIO;
    }
}
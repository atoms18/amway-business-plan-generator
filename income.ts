
import { ABO } from "./internal";
import { DiscountCalculate } from "./util";

export class Income {
    private static PVBV_RATIO = 3.23;

    public static SILVER_VOLUME = 150_000;
    public static BREAK_AWAY_DISCOUNT_PERCENT = 21;
    private static FRANCHISE_INCOME_PERCENT = 6;

    public static MINIMUM_ฺฺBALANCE_VOLUME = 55_000;
    private static GARANTEE_VOLUME = Income.SILVER_VOLUME;

    private static RUBY_VOLUME = 300_000;
    private static RUBY_INCOME_PERCENT = 2;

    private static PEARL_INCOME_PERCENT = 1;
    
    constructor(
        private discount = 0,
        private franchise = 0,
        private ruby = 0,
        private pearl = 0
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
    public getPearl() {
        return this.pearl;
    }

    public setZero() {
        this.discount = 0;
        this.franchise = 0;
        this.ruby = 0;
        this.pearl = 0;
    }

    public calculateDiscountIncome(pv: number, fls: ABO[]) {
        this.discount = this.discountIncomeCalculate(DiscountCalculate(pv), pv);
        this.discount -= fls.reduce((dl_sum, dl) => dl_sum + this.discountIncomeCalculate(dl.getDiscount(), dl.getPV()), 0);
    }
    public calculateFranchiseIncome(gpv: number, fls: ABO[]) {
        let garantee = Income.GARANTEE_VOLUME - gpv;
        garantee = garantee < 0 ? 0:garantee;
        const franchiseVolume = fls.reduce((vol, fl) => {
            if(fl.getDiscount() == Income.BREAK_AWAY_DISCOUNT_PERCENT) vol += fl.getPV();
            return vol;
        }, 0);
        this.franchise = this.discountIncomeCalculate(Income.FRANCHISE_INCOME_PERCENT, franchiseVolume - garantee);
    }
    public calculateRubyIncome(gpv: number) {
        if(gpv > Income.RUBY_VOLUME) this.ruby = this.discountIncomeCalculate(Income.RUBY_INCOME_PERCENT, gpv)
    }
    public calculatePearlIncome(fls: ABO[]) {
        const activeFLs = fls.map((fl) => {
            // while(fl.getDiscount() != 21 || fl.getGPV() == 0) {
            //     fl = 
            // }
            return fl;
        });
        let income = 0;
        for(const fl of fls) {
            if(fl.isPearl) continue;
            income += this.accomulatePearlIncome(fl.fls);
        }
        this.pearl = income;
    }
    private accomulatePearlIncome(dlFLs: ABO[]): number {
        let income = 0;
        for(const dlfl of dlFLs) {
            if(dlfl.isPearl || dlfl.getDiscount() != 21) continue;
            income += this.discountIncomeCalculate(Income.PEARL_INCOME_PERCENT, dlfl.getGPV());
            income += this.accomulatePearlIncome(dlfl.fls);
        }
        return income;
    }

    private discountIncomeCalculate(discount: number, pv: number) {
        return (discount / 100) * pv * Income.PVBV_RATIO;
    }
}

import { ABO, Member } from "./internal";
import { DiscountCalculate } from "./util";

export class Income {
    private static PVBV_RATIO = 3.23;

    public static BREAK_AWAY_VOLUME = 150_000;
    public static BREAK_AWAY_DISCOUNT_PERCENT = 21;

    public static MINIMUM_ฺBALANCE_VOLUME = 55_000;
    private static GARANTEE_VOLUME = Income.BREAK_AWAY_VOLUME;
    private static FRANCHISE_INCOME_PERCENT = 6;

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
            if(fl.isBreakAway) vol += fl.getPV();
            return vol;
        }, 0);
        this.franchise = this.discountIncomeCalculate(Income.FRANCHISE_INCOME_PERCENT, franchiseVolume - garantee);
    }
    public calculateRubyIncome(gpv: number) {
        if(gpv > Income.RUBY_VOLUME) this.ruby = this.discountIncomeCalculate(Income.RUBY_INCOME_PERCENT, gpv)
    }
    public calculatePearlIncome(fls: ABO[]) {
        let acc = 0;
        for(const fl of fls) {
            if(!fl.isBreakAway) continue; // gonna check only on break-away line because of their pv already accumulate their non-break dls

            let volume = fl.fls.filter(fl => !(fl instanceof Member)).reduce((vol, fl) => vol + fl.getPV(), 0); // first, assume that fl volume are fl's abo volume sum
            if(fl.isPearl) {
                volume -= this.calculatePearlVolume(fl); // if fl are pearl, then subtract total with their volume
            } else {
                const garantee = Income.GARANTEE_VOLUME - fl.getGPV();
                volume -= garantee < 0 ? 0:garantee; // and subtract total with a garantee to ul, now total can already be use as pearl volume
                volume -= this.accumulateDeepPearlVolume(fl.fls); // but if fl got pearl of their own, subtract total with deep pearl volume
            }
            acc += volume;
        }
        this.pearl = this.discountIncomeCalculate(Income.PEARL_INCOME_PERCENT, acc);
    }
    private accumulateDeepPearlVolume(dlFLs: ABO[]): number {
        let acc = 0;
        for(const dlfl of dlFLs) {
            if(!dlfl.isBreakAway) continue;
            
            if(dlfl.isPearl) {
                acc += this.calculatePearlVolume(dlfl);
            } else {
                acc += this.accumulateDeepPearlVolume(dlfl.fls); // continue find for possible deep pearl
            }
        }
        return acc;
    }
    private calculatePearlVolume(dlPearl: ABO): number {
        // a deep pearl responsible to ul only for their group volume and their break-away's group volume
        let acc = dlPearl.getPV();
        acc -= dlPearl.getGPV() < Income.GARANTEE_VOLUME ? Income.GARANTEE_VOLUME:dlPearl.getGPV(); // their group volume
        for(const dlPearlFL of dlPearl.fls) {
            if(!dlPearlFL.isBreakAway) continue;

            acc -= dlPearlFL.getGPV() < Income.GARANTEE_VOLUME ? Income.GARANTEE_VOLUME:dlPearlFL.getGPV();  // their break-away's group volume
        }
        return acc;
    }

    private discountIncomeCalculate(discount: number, pv: number) {
        return (discount / 100) * pv * Income.PVBV_RATIO;
    }
}
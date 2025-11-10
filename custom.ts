
import { ABO } from "./internal";

export class BuzzoluteABO extends ABO {
    public override fls: BuzzoluteABO[] = [];

    private turnpro = false;
    private turnproplus = false;

    isTurnPro() {
        return this.turnpro;
    }
    isTurnProPlus() {
        return this.turnproplus;
    }

    override sponsor(name?: string): ABO {
        const newABO = new BuzzoluteABO(this, name);
        this.fls.push(newABO);
        this.turnProChecker();
        return newABO;
    }

    protected turnProChecker() {
        const moreSeven = this.fls.find((fl) => fl.dls.length + 1 >= 7);
        const moreSevenFitlerOut = this.fls.filter((fl) => fl.getName() != moreSeven?.getName());
        const more3 = moreSevenFitlerOut.find((fl) => fl.dls.length + 1 >= 3);
        this.turnpro = !!moreSeven && !!more3;

        const more14 = this.fls.find((fl) => fl.dls.length + 1 >= 14);
        const more14FitlerOut = this.fls.filter((fl) => fl.getName() != more14?.getName());
        const more7 = more14FitlerOut.find((fl) => fl.dls.length + 1 >= 7);
        const more7FitlerOut = more14FitlerOut.filter((fl) => fl.getName() != more7?.getName());
        const more1 = more7FitlerOut.find((fl) => fl.dls.length + 1 >= 1);
        this.turnproplus = !!more14 && !!more7 && !!more1;
    }

    override buy(volume: number): BuzzoluteABO;
    override buy(volume: number, dl: ABO | null): BuzzoluteABO;
    override buy(volume: number, dl: ABO | null=null): BuzzoluteABO {
        super.buy(volume, dl);
        return this;
    }
}

export class CustomABO extends BuzzoluteABO {
    constructor(ul: ABO | null, name?: string) {
        super(ul, name);
        this.buy(500);
    }

    override sponsor(name?: string): ABO {
        const newABO = new CustomABO(this, name);
        this.fls.push(newABO);
        this.turnProChecker();
        return newABO;
    }
}

export const DiscountCalculate = (pv: number) => {
    return pv < 2500
        ? 0
        : pv < 5000
            ? 3
            : pv < 15000
                ? 6
                : pv < 30000
                    ? 9
                    : pv < 55000
                        ? 12
                        : pv < 90000
                            ? 15
                            : pv < 150000
                                ? 18
                                : 21;
}
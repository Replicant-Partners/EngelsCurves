(function (root) {
  const pensionCalculations = {
    presentValue(rate, years = 30, payment = 1) {
      if (rate <= -1 || years < 1) throw new RangeError('Invalid liability inputs');
      if (rate === 0) return payment * years;
      return payment * (1 - Math.pow(1 + rate, -years)) / rate;
    },

    macaulayDuration(rate, years = 30) {
      if (rate <= -1 || years < 1) throw new RangeError('Invalid duration inputs');
      if (rate === 0) return (years + 1) / 2;
      return (1 + rate) / rate - years / (Math.pow(1 + rate, years) - 1);
    },

    modifiedDuration(rate, years = 30) {
      return this.macaulayDuration(rate, years) / (1 + rate);
    },

    exactChange(rate, newRate, years = 30) {
      return this.presentValue(newRate, years) / this.presentValue(rate, years) - 1;
    },

    durationChange(rate, rateMove, years = 30) {
      return -this.modifiedDuration(rate, years) * rateMove;
    },

    requiredEquityWeight(bondReturn, equityReturn, targetReturn) {
      if (bondReturn >= targetReturn) return 0;
      if (equityReturn <= bondReturn) return Infinity;
      return (targetReturn - bondReturn) / (equityReturn - bondReturn);
    }
  };

  root.PensionCalculations = pensionCalculations;
})(typeof window === 'undefined' ? globalThis : window);

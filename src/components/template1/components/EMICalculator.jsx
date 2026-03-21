import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "../css/EMICalculator.module.css";

Chart.register(ArcElement, Tooltip, Legend);

const EMICalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const calculateEMI = () => {
    if (principal && rate && time) {
      const monthlyRate = rate / 100 / 12;
      const months = time * 12;
      const emiValue =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayable = emiValue * months;
      const totalInt = totalPayable - principal;
      setEmi(emiValue.toFixed(2));
      setTotalInterest(totalInt.toFixed(2));
      setTotalPayment(totalPayable.toFixed(2));
    }
  };

  const chartData = {
    labels: ["Principal", "Total Interest"],
    datasets: [{
      data: [principal || 0, totalInterest || 0],
      backgroundColor: ["#1a1d29", "#c9a227"],
      hoverBackgroundColor: ["#2d3142", "#a8861f"],
      borderWidth: 0,
    }],
  };

  const hasResult = emi > 0;

  return (
    <section className={styles.section} id="emi-calculator">
      <div className={styles.container}>
        <header className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Plan your investment</span>
          <h2 className={styles.sectionTitle}>Home Loan EMI Calculator</h2>
          <p className={styles.sectionDesc}>
            Estimate your monthly instalment and see how principal and interest add up—so you can plan your purchase with confidence.
          </p>
        </header>

        <div className={styles.layout}>
          {/* Left: Real estate context panel */}
          <div className={styles.leftPanel}>
            <div className={styles.panelCard}>
              <h3 className={styles.panelTitle}>Why plan your EMI?</h3>
              <ul className={styles.bullets}>
                <li>
                  <span className={styles.bulletIcon} aria-hidden>1</span>
                  <span>Know your monthly outflow before you shortlist properties.</span>
                </li>
                <li>
                  <span className={styles.bulletIcon} aria-hidden>2</span>
                  <span>Compare loan tenures and see how interest adds up over time.</span>
                </li>
                <li>
                  <span className={styles.bulletIcon} aria-hidden>3</span>
                  <span>Adjust amount, rate & tenure to find a plan that fits your budget.</span>
                </li>
              </ul>
              <div className={styles.panelFooter}>
                <p className={styles.panelFooterText}>Rates and eligibility depend on bank policies. Use this as an estimate.</p>
              </div>
            </div>
          </div>

          {/* Right: Calculator form + results */}
          <div className={styles.rightPanel}>
            <div className={styles.formCard}>
              <h3 className={styles.formCardTitle}>Your loan details</h3>
              <div className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="emi-principal">Loan amount (₹)</label>
                  <input
                    id="emi-principal"
                    type="number"
                    placeholder="e.g. 50,00,000"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    className={styles.input}
                    min="0"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="emi-rate">Interest rate (% per year)</label>
                  <input
                    id="emi-rate"
                    type="number"
                    placeholder="e.g. 8.5"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className={styles.input}
                    min="0"
                    max="30"
                    step="0.1"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="emi-tenure">Tenure (years)</label>
                  <input
                    id="emi-tenure"
                    type="number"
                    placeholder="e.g. 20"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={styles.input}
                    min="1"
                    max="30"
                  />
                </div>
                <button
                  type="button"
                  onClick={calculateEMI}
                  disabled={!principal || !rate || !time}
                  className={styles.btn}
                >
                  Calculate EMI
                </button>
              </div>
            </div>

            {hasResult && (
              <div className={styles.result}>
                <div className={styles.emiHero}>
                  <span className={styles.emiHeroLabel}>Your monthly EMI</span>
                  <p className={styles.emiHeroValue}>
                    ₹{parseFloat(emi).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </p>
                  <span className={styles.emiHeroSub}>per month</span>
                </div>
                <div className={styles.breakdown}>
                  <h4 className={styles.breakdownTitle}>Breakdown</h4>
                  <div className={styles.cards}>
                    <div className={styles.card}>
                      <span className={styles.cardLabel}>Loan amount</span>
                      <span className={styles.cardVal}>₹{parseFloat(principal).toLocaleString("en-IN")}</span>
                    </div>
                    <div className={styles.card}>
                      <span className={styles.cardLabel}>Total interest</span>
                      <span className={styles.cardVal}>₹{parseFloat(totalInterest).toLocaleString("en-IN")}</span>
                    </div>
                    <div className={styles.card}>
                      <span className={styles.cardLabel}>Total payment</span>
                      <span className={styles.cardVal}>₹{parseFloat(totalPayment).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.chartSection}>
                  <h4 className={styles.chartTitle}>Principal vs interest</h4>
                  <div className={styles.chartWrap}>
                    <Doughnut
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        cutout: "58%",
                        plugins: {
                          legend: { position: "bottom" },
                          tooltip: {
                            callbacks: {
                              label: (ctx) =>
                                `${ctx.label}: ₹${(ctx.parsed || 0).toLocaleString("en-IN")}`,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EMICalculator;

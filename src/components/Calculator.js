import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import Grid from "@material-ui/core/Grid";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import styles from "./Calculator.module.css";

import { formatPrice } from "../helpers";

const Calculator = (props) => {
    const { msrp, fees, delivery, prices, type } = props;

    const [term, setTerm] = useState(prices[0]);
    const [cashdown, setCashdown] = useState(0);
    const [tradein, setTradein] = useState(0);
    const [taxes, setTaxes] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [incentive, setIncentive] = useState(0);
    const [total, setTotal] = useState(0);

    const [payments, setPayments] = useState({
        weekly: 0,
        biWeekly: 0,
        monthly: 0,
    });

    const [includeTaxes, setIncludeTaxes] = useState(false);

    const refreshCalculator = () => {
        let values = {
            cashdown: cashdown,
            tradein: tradein,
            term: term,
            includeTaxes: includeTaxes ? 1 : 0,
        };

        /* Apply default values */
        if (values["cashdown"] === "") {
            values["cashdown"] = 0;
        }
        if (values["trade-in"] === "") {
            values["trade-in"] = 0;
        }

        var amount = msrp + fees + delivery - term.incentive;

        setIncentive(term.incentive);
        setSubtotal(amount + term.incentive);
        setTotal(amount);

        var frequencies = [
            {
                name: "monthly",
                frequency: 12,
                label: " / month",
            },
            {
                name: "biWeekly",
                frequency: 26,
                label: " / 2 weeks",
            },
            {
                name: "weekly",
                frequency: 52,
                label: " / week.",
            },
        ];

        let payments = {};
        frequencies.forEach((single_frequency) => {
            var payment = 0;
            if (type == "finance") {
                payment = calculate_finance_payment(
                    amount,
                    values["cashdown"],
                    values["tradein"],
                    term.term,
                    term.rate * 100,
                    single_frequency["frequency"],
                    values["includeTaxes"]
                );
            } else {
                payment = calculate_lease_payment(
                    amount,
                    values["cashdown"],
                    values["tradein"],
                    term.term,
                    term.rate * 100,
                    single_frequency["frequency"],
                    values["includeTaxes"],
                    term.residual
                );
            }

            payments[single_frequency["name"]] = payment;
        });

        setPayments(payments);

        if (includeTaxes) {
            let total_taxes = amount * 0.14975;
            setTaxes(total_taxes);
            setTotal(amount + total_taxes);
        } else {
            setTaxes(0);
        }
    };

    /* Based on https://m.wikihow.com/Calculate-Auto-Loan-Payments */
    const calculate_finance_payment = (
        total_amount,
        cashdown_amount,
        tradein_amount,
        term,
        rate,
        frequency,
        taxable
    ) => {
        if (rate === 0) {
            rate = 0.00001;
        }

        total_amount -= tradein_amount;

        /* Do NOT calculate taxes on trade in */
        if (taxable === 1) {
            total_amount *= 1.14975;
        }

        total_amount -= cashdown_amount;

        var rate_yearly = rate / 100;

        var r = rate_yearly / 12;

        var payment =
            total_amount *
            ((Math.pow(1 + r, term) * r) / (Math.pow(1 + r, term) - 1));

        if (frequency !== 12) {
            payment /= frequency / 12;
        }

        //console.log(total_amount, cashdown_amount, tradein_amount, term, rate, frequency, taxable, payment);

        return payment;
    };

    /* Based on https://www.calculator.net/auto-lease-calculator.html */
    const calculate_lease_payment = (
        total_amount,
        cashdown_amount,
        tradein_amount,
        term,
        rate,
        frequency,
        taxable,
        residual
    ) => {
        //console.log("calculate_lease_payment(" + total_amount + "," + cashdown_amount + "," + tradein_amount + "," + term + "," + rate + "," + frequency + "," + taxable + "," + residual + ")");
        var months = term;

        var residual_amount = parseFloat(total_amount) * parseFloat(residual);
        if (isNaN(residual_amount)) {
            residual_amount = 0;
        }

        total_amount -= parseInt(tradein_amount);
        total_amount -= parseInt(cashdown_amount);

        var money_factor = parseFloat(rate) / 2400;

        var depreciation_amount = parseFloat(total_amount) - residual_amount;

        var base_payment = depreciation_amount / months;
        var monthly_rent = (total_amount + residual_amount) * money_factor;

        var tax_amount = 0;
        if (taxable === 1) {
            //total_amount_taxable = calculate_lease_payment(total_amount, cashdown_amount, tradein_amount, term, rate, frequency, 0, residual);
            tax_amount = (base_payment + monthly_rent) * 0.14975;
        }

        var lease_payment = base_payment + monthly_rent + tax_amount;

        if (frequency > 12) {
            return (lease_payment /= frequency / 12);
        }

        //console.log("lease", months, residual_amount, money_factor, depreciation_amount, base_payment, monthly_rent, lease_payment);

        return lease_payment;
    };

    useEffect(() => {
        if (type !== "cash") {
            refreshCalculator();
        } else {
            let total = msrp + fees + delivery;
            if (prices !== undefined && prices.incentive > 0) {
                setIncentive(prices.incentive);
                setSubtotal(total);
                total -= prices.incentive;
            }
            setTotal(total);
        }
    }, [tradein, cashdown, includeTaxes, term]);

    return (
        <div>
            {type !== "cash" && (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <FormControl className={styles.formControl}>
                            <InputLabel id="demo-simple-select-label">
                                Term
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={term}
                                onChange={(event) =>
                                    setTerm(event.target.value)
                                }
                            >
                                {prices.map((price) => (
                                    <MenuItem key={price.term} value={price}>
                                        {price.term} month @{" "}
                                        {(price.rate * 100).toFixed(2)} %
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            id="standard-number"
                            label="Cashdown ($)"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={cashdown}
                            onChange={(event) =>
                                setCashdown(event.target.value)
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            id="standard-number"
                            label="Trade-in ($)"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={tradein}
                            onChange={(event) => setTradein(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeTaxes}
                                    onChange={(event) =>
                                        setIncludeTaxes(event.target.checked)
                                    }
                                    name="includeTaxes"
                                    color="primary"
                                />
                            }
                            label="Include taxes?"
                        />
                    </Grid>
                </Grid>
            )}

            <Grid container>
                <Grid item xs={12} sm={6}>
                    <Typography>MSRP: {formatPrice(msrp)}</Typography>
                    <Typography>Fees: {formatPrice(fees)}</Typography>
                    <Typography>Delivery: {formatPrice(delivery)}</Typography>
                    {incentive > 0 && (
                        <>
                            <Typography>
                                Sub-total: {formatPrice(subtotal)}
                            </Typography>
                            <Typography>
                                Incentive: -{formatPrice(incentive)}
                            </Typography>
                        </>
                    )}
                    {includeTaxes > 0 && (
                        <Typography>Taxes: {formatPrice(taxes)}</Typography>
                    )}
                    <Typography variant="h6">
                        Total: {formatPrice(total)}
                    </Typography>
                </Grid>
                {type !== "cash" && (
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h5">
                            Weekly: {formatPrice(payments.weekly)}
                        </Typography>
                        <Typography variant="h5">
                            Bi-Weekly: {formatPrice(payments.biWeekly)}
                        </Typography>
                        <Typography variant="h5">
                            Monthly: {formatPrice(payments.monthly)}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </div>
    );
};
export default Calculator;

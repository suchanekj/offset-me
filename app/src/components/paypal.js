import React from "react";
import Paypal from "gatsby-plugin-paypal";

export const PayPalButton = ({ items }) => {
  const total = items.reduce((acc, [_, value]) => acc + value, 0);

  // Add in PayPal's commission
  // https://www.paypal.com/uk/webapps/mpp/merchant-fees
  const commission = total <= 5 ? (0.05 + 0.05 * total) / 0.95 : (0.3 + 0.029 * total) / 0.971;

  const totalWithCommission = total + commission;

  const createOrderPaypal = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "GBP",
            value: totalWithCommission.toFixed(2),
            breakdown: {
              item_total: { currency_code: "GBP", value: total.toFixed(2) },
              handling: { currency_code: "GBP", value: commission.toFixed(2) },
            },
          },
          items: items.map(([name, value]) => ({
            name,
            unit_amount: { currency_code: "GBP", value: value.toFixed(2) },
            quantity: 1,
          })),
        },
      ],
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Paypal
        // change the key to force a remount of the component which is needed for it to pick up the new createOrder callback
        key={total}
        style={{
          color: "blue",
        }}
        createOrder={createOrderPaypal}
      />
      <div class="card">
        <div class="card-content has-text-left">
          <div class="columns">
            <div class="column is-italic">Donation:</div>
            <div class="column">£{total.toFixed(2)}</div>
          </div>
          <div class="columns">
            <div class="column is-italic">PayPal processing fee:</div>
            <div class="column">£{commission.toFixed(2)}</div>
          </div>
          <div class="columns">
            <div class="column has-text-weight-semibold">Total:</div>
            <div class="column">£{totalWithCommission.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import Paypal from "gatsby-plugin-paypal";

export const PayPalButton = ({ items }) => {
  const total = items.reduce((acc, [_, value]) => acc + value, 0);

  const createOrderPaypal = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "GBP",
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code: "GBP", value: total.toFixed(2) },
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
    </div>
  );
};

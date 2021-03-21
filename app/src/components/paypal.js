import React from "react";
import Paypal from "gatsby-plugin-paypal";

export const PayPalButton = () => {
  const createOrderPaypal = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "GBP",
            value: "10",
          },
          //   items: [{ name: "ITEM 1" }],
        },
      ],
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Paypal
        style={{
          color: "blue",
        }}
        createOrder={createOrderPaypal}
      />
    </div>
  );
};

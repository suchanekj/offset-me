import React, { useState, useMemo, useEffect } from "react";
import { fromJS } from "immutable";

import "../styles.scss";
import { Layout, PayPalButton, Slider, InfoPopup, Tabs } from "../components";
import { useStaticQuery } from "gatsby";

function createKeyPath(path, property) {
  const keyPath = path.reduce((acc, element) => {
    acc.push("children", element);
    return acc;
  }, []);
  keyPath.push(property);
  return keyPath;
}

function getValue(tree, path, property, value) {
  return tree.getIn(createKeyPath(path, property), value);
}
function insertValue(tree, path, property, value) {
  return tree.setIn(createKeyPath(path, property), value);
}

export default function Index() {
  const data = useStaticQuery(graphql`
    query {
      allAreasCsv {
        nodes {
          slider
          low
          mid
          high
          max
          unit
          initialValue
          calculateDonation
          level
          charities {
            Malaria_Consortium
            Against_Malaria_Foundation
            Deworm_the_World
            Helen_Keller_International
            New_Incentives
            GiveDirectly
            The_END_Fund
            SCI_Foundation
            Sightsavers
            Village_Enterprise
            Seva
            JAAGO_Foundation
            UNICEF_south_africa
            Lola_Karimova_Tillyaeva
            Cambodian_Childrens_Fund
            Plan_vivo
            Gold_Standard
            Founders_Pledge_Climate_change_fund
            Clean_Air_Task_Force
            World_Wildlife_Fund
            Cool_earth
            ACEs_Recommended_Charity_Fund
            New_Harvest
            Oceana
            Environmental_Working_Group
            Rainforest_alliance
            Sustainable_Food_Trust
            OceanCleanup
          }
        }
      }
      allMethodsCsv {
        nodes {
          slider
          initialValue
          charities {
            Malaria_Consortium
            Against_Malaria_Foundation
            Deworm_the_World
            Helen_Keller_International
            New_Incentives
            GiveDirectly
            The_END_Fund
            SCI_Foundation
            Sightsavers
            Village_Enterprise
            Seva
            JAAGO_Foundation
            UNICEF_south_africa
            Lola_Karimova_Tillyaeva
            Cambodian_Childrens_Fund
            Plan_vivo
            Gold_Standard
            Founders_Pledge_Climate_change_fund
            Clean_Air_Task_Force
            World_Wildlife_Fund
            Cool_earth
            ACEs_Recommended_Charity_Fund
            New_Harvest
            Oceana
            Environmental_Working_Group
            Rainforest_alliance
            Sustainable_Food_Trust
            OceanCleanup
          }
        }
      }
    }
  `);

  // create a tree of sliders from the CSV table
  const areaSlidersTree = useMemo(
    () =>
      data.allAreasCsv.nodes.reduce(
        (acc, { slider, initialValue, ...metadata }) => {
          let obj = acc;
          for (let child of slider) {
            // create children if it doesn't yet exist
            obj.children = obj.children || {};
            // create child if it doesn't yet exist
            obj.children[child] = obj.children[child] || {};
            // get next child
            obj = obj.children[child];
          }
          obj.metadata = metadata;
          obj.value = Number(initialValue);
          obj.path = slider;
          return acc;
        },
        {}
      ),
    [data]
  );
  const methodSlidersTree = useMemo(
    () =>
      data.allAreasCsv.nodes.reduce(
        (acc, { slider, initialValue, ...metadata }) => {
          let obj = acc;
          for (let child of slider) {
            // create children if it doesn't yet exist
            obj.children = obj.children || {};
            // create child if it doesn't yet exist
            obj.children[child] = obj.children[child] || {};
            // get next child
            obj = obj.children[child];
          }
          obj.metadata = metadata;
          obj.value = Number(initialValue);
          obj.path = slider;
          return acc;
        },
        {}
      ),
    [data]
  );
  const [openedSliders, setOpenedSliders] = useState({});
  const [areaSliders, setAreaSliders] = useState(fromJS(areaSlidersTree));
  const [methodSliders, setMethodSliders] = useState(fromJS(methodSlidersTree));
  const [donations, setDonations] = useState({}); // of the form { CharityA: 0, ...}

  function equaliseMethodSliders(currentName, newValue, siblings) {
    const currentSum = Object.entries(siblings).reduce(
      (acc, [_, { value }]) => acc + Number(value),
      0
    );
    const currentTotalOfOtherSliders = currentSum - siblings[currentName].value;
    const whatItNeedsToBe = 100 - newValue;
    const multiplier = whatItNeedsToBe / currentTotalOfOtherSliders;
    setMethodSliders((methodSliders) =>
      Object.entries(siblings).reduce((tree, [name, { value, path }]) => {
        const equalisedValue =
          currentName === name
            ? newValue
            : value === 0
            ? 1
            : value * multiplier;
        return insertValue(tree, path, "value", equalisedValue);
      }, methodSliders)
    );
  }

  function scaleAreaChildren(tree, children_to_change, newValue) {
    if (children_to_change) {
      const childrenEntries = Object.entries(children_to_change);
      const currentSumOfChildren = childrenEntries.reduce(
        (acc, [_, { value }]) => acc + Number(value),
        0
      );
      const multiplier = newValue / currentSumOfChildren;

      let finished = true;
      for (let [x, { value, metadata, path, children }] of childrenEntries) {
        if (metadata.unit === "£") {
          let newChildValue =
            currentSumOfChildren === 0
              ? newValue / Object.keys(children_to_change).length
              : value * multiplier;
          if (newChildValue >= Number(metadata.max)) {
            newChildValue = Number(metadata.max);
            newValue = newValue - newChildValue;
            delete children_to_change[x];
            finished = false;
          }
          tree = insertValue(tree, path, "value", newChildValue);
          if (newChildValue === Number(metadata.max)) {
            tree = scaleAreaChildren(tree, children, newChildValue);
          }
        }
      }
      if (finished === false) {
        tree = scaleAreaChildren(tree, children_to_change, newValue);
      } else {
        for (let [x, { value, metadata, path, children }] of childrenEntries) {
          if (metadata.unit === "£") {
            let newChildValue = value === 0 ? 0.01 : value * multiplier;
            tree = scaleAreaChildren(tree, children, newChildValue);
          }
        }
      }
    }

    return tree;
  }

  function scaleAreaSliders(newValue, path, children) {
    const parentPath = path.slice(0, path.length - 1);

    setAreaSliders((areaSliders) => {
      let tree = areaSliders;

      const oldValue = getValue(tree, path, "value");
      const difference = newValue - oldValue;

      // scale parent slider
      const oldParentValue = getValue(tree, parentPath, "value");
      const newParentValue = Number(oldParentValue + difference);
      tree = insertValue(tree, parentPath, "value", newParentValue);

      // scale grandparent slider
      const grandparentPath = path.slice(0, path.length - 2);
      const oldGrandparentValue = getValue(tree, grandparentPath, "value");
      const newGrandparentValue = Number(oldGrandparentValue + difference);
      tree = insertValue(tree, grandparentPath, "value", newGrandparentValue);

      // scale children sliders
      tree = scaleAreaChildren(tree, children, newValue);

      // set value
      return insertValue(tree, path, "value", newValue);
    });
  }

  useEffect(() => {
    // calculate donations
    let charityMultipliers = data.allMethodsCsv.nodes.reduce(
      (acc, { methodSlider, charities }) => {
        const obj = methodSlider.reduce(
          (obj, child) => obj.children[child],
          methodSliders.toJS()
        );

        if (obj.metadata.calculateDonation === "value") {
          for (let [charity, coeff] of Object.entries(charities)) {
            acc[charity] = acc[charity] || 1; // default multiplier to 1
            acc[charity] *= 1 + (obj.value * coeff) / 100;
            acc[charity] += 1e-6;  // make sure there is no division by zero later
          }
        }
        return acc;
      },
      {}
    );
    let donations = data.allAreasCsv.nodes.reduce(
      (acc, { areaSlider, charities }) => {
        const obj = areaSlider.reduce(
          (obj, child) => obj.children[child],
          areaSliders.toJS()
        );

        if (obj.metadata.calculateDonation === "value") {
          let sliderCharityCoeffs = charityMultipliers
          let sliderCharityCoeffsSum = 0
          for (let [charity, coeff] of Object.entries(charities)) {
            sliderCharityCoeffs[charity] *= coeff
            sliderCharityCoeffsSum += sliderCharityCoeffs[charity]
          }

          for (let [charity, coeff] of Object.entries(charities)) {
            acc[charity] = acc[charity] || 0; // default donation to 0
            let multiplier = sliderCharityCoeffs[charity] / sliderCharityCoeffsSum;
            // let childEntries = Object.entries(obj.children || {});
            // if (childEntries.length > 0) {
            //   multiplier = childEntries.reduce(
            //     (acc, [_, { metadata, value }]) =>
            //       acc + (metadata.charities[charity] * value) / 100,
            //     0
            //   );
            // }
            acc[charity] += obj.value * multiplier;
            acc[charity] = Math.round(acc[charity] * 100) / 100;
          }
        }
        return acc;
      },
      {}
    );

    // remove underscores
    donations = Object.entries(donations).reduce((acc, [charity, donation]) => {
      acc[charity.replaceAll("_", " ")] = donation;
      return acc;
    }, {});

    setDonations(donations);
  }, [areaSliders, data.allAreasCsv, methodSliders, data.allMethodsCsv]);

  function renderSliders(sliders, type) {
    return Object.entries(sliders).map(([name, properties]) => {
      const { value, metadata, path, children } = properties;
      const isOpen = Boolean(openedSliders[name]);
      return (
        <>
          <div class="columns is-vcentered is-mobile">
            <div class="column form-row">
              <Slider
                name={name}
                value={value}
                setValue={(value) => {
                  if (type === "methods") {
                    equaliseMethodSliders(name, value, sliders);
                  } else if(type === "areas"){
                    scaleAreaSliders(value, path, children);
                  }
                }}
                {...metadata}
              />
            </div>
            {children ? (
              <span class="column is-1 icon is-large is-clickable">
                <i
                  class={`fas fa-lg ${
                    isOpen ? "fa-caret-down" : "fa-caret-right"
                  }`}
                  onClick={() =>
                    setOpenedSliders((openedSliders) => ({
                      ...openedSliders,
                      [name]: !isOpen,
                    }))
                  }
                ></i>
              </span>
            ) : null}
          </div>
          {isOpen ? renderSliders(children) : null}
        </>
      );
    });
  }

  const total =
    Math.round(
      Object.entries(donations).reduce((acc, [_, value]) => acc + value, 0) *
        100
    ) / 100;

  return (
    <Layout>
      <div className="box">
        <b>Efficiently undo negative effects of your consumption.</b> The goal isn't to fix any of these problems but
        to stop making them worse. We don't understand any of these cause areas enough to be able to say they can be left
        for later while we focus on climate change and other pressing problems. Hence our recommendation is to reduce
        what damage you do in all of these areas, offset yourself for where that isn't possible and then do good
        on top of that through organizations like <a href="https://www.effectivealtruism.org/">Effective Altruism</a>.
        More info on methodology in <a href="/documentation">docs</a>. <b> We would appreciate any
        <a href="/contact"> feedback</a></b>.
      </div>
      <div class="box">
        <Tabs>
          <div label="Self evaluation">
          </div>
          <div label="Offsetting methods">
            {renderSliders(methodSliders.toJS().children, "methods")}
          </div>
          <div label="Areas to offset">
            {renderSliders(areaSliders.toJS().children, "areas")}
          </div>
        </Tabs>
      </div>
      <div className="columns">
        <div className="column">
          <div className="box">
            <table className="table is-striped is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th>Charity</th>
                  <th>Monthly</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>Overall monthly donation</b>
                  </td>
                  <td>
                    <b>£{total.toFixed(2)}</b>
                  </td>
                </tr>
                {Object.entries(donations)
                  .sort((a, b) => b[1] - a[1])
                  .map(([charity, donation]) =>
                    donation ? (
                      <tr>
                        <td>{charity}</td>
                        <td>£{donation.toFixed(2)}</td>
                      </tr>
                    ) : null
                  )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="column">
          <div className="box">
            As we are only just launching, donations are one-time. <a href="/news">Subscribe</a> to get notified when
            monthly subscription gets launched.

            <PayPalButton items={Object.entries(donations)} />
            (It's impossible to avoid a payment fee using card payments, just usually it's hidden from the customer.
            It will be higher if a non-UK card is used. We will notify you when we pass on your donation where exactly
            your money went.)
          </div>
        </div>
      </div>
    </Layout>
  );
}

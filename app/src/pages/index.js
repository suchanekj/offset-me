import React, { useState, useMemo, useEffect } from "react";
import { fromJS } from "immutable";

import "../styles.scss";
import { Layout, PayPalButton, Slider } from "../components";
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
      allCalculationsCsv {
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
            WILD_Foundation
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
  const slidersTree = useMemo(
    () =>
      data.allCalculationsCsv.nodes.reduce(
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
  const [sliders, setSliders] = useState(fromJS(slidersTree));
  const [donations, setDonations] = useState({}); // of the form { CharityA: 0, ...}

  function equaliseSliders(currentName, newValue, siblings) {
    const currentSum = Object.entries(siblings).reduce(
      (acc, [_, { value }]) => acc + Number(value),
      0
    );
    const currentTotalOfOtherSliders = currentSum - siblings[currentName].value;
    const whatItNeedsToBe = 100 - newValue;
    const multiplier = whatItNeedsToBe / currentTotalOfOtherSliders;
    setSliders((sliders) =>
      Object.entries(siblings).reduce((tree, [name, { value, path }]) => {
        const equalisedValue =
          currentName === name
            ? newValue
            : value === 0
            ? 1
            : value * multiplier;
        return insertValue(tree, path, "value", equalisedValue);
      }, sliders)
    );
  }

  function scaleChildren(tree, children_to_change, newValue) {
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
          // tree = scaleChildren(tree, children, value);
          if (newChildValue === Number(metadata.max)) {
            tree = scaleChildren(tree, children, newChildValue);
          }
        }
      }
      if (finished === false) {
        tree = scaleChildren(tree, children_to_change, newValue);
      } else {
        for (let [x, { value, metadata, path, children }] of childrenEntries) {
          if (metadata.unit === "£") {
            let newChildValue = value === 0 ? 0.01 : value * multiplier;
            tree = scaleChildren(tree, children, newChildValue);
          }
        }
      }
    }

    return tree;
  }

  function scaleSliders(newValue, path, children) {
    const parentPath = path.slice(0, path.length - 1);

    setSliders((sliders) => {
      let tree = sliders;

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
      tree = scaleChildren(tree, children, newValue);

      // set value
      return insertValue(tree, path, "value", newValue);
    });
  }

  useEffect(() => {
    // calculate donations
    let donations = data.allCalculationsCsv.nodes.reduce(
      (acc, { slider, charities }) => {
        const obj = slider.reduce(
          (obj, child) => obj.children[child],
          sliders.toJS()
        );

        if (obj.metadata.calculateDonation === "value") {
          for (let [charity, coeff] of Object.entries(charities)) {
            acc[charity] = acc[charity] || 0; // default donation to 0
            let multiplier = coeff;
            let childEntries = Object.entries(obj.children || {});
            if (childEntries.length > 0) {
              multiplier = childEntries.reduce(
                (acc, [_, { metadata, value }]) =>
                  acc + (metadata.charities[charity] * value) / 100,
                0
              );
            }
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
  }, [sliders, data.allCalculationsCsv]);

  function renderSliders(sliders) {
    return Object.entries(sliders).map(([name, properties]) => {
      const { value, metadata, path, children } = properties;
      const isOpen = Boolean(openedSliders[name]);
      return (
        <>
          <div class="columns is-vcentered">
            <div class="column form-row">
              <Slider
                name={name}
                value={value}
                setValue={(value) => {
                  if (metadata.unit === "%") {
                    equaliseSliders(name, value, sliders);
                  } else {
                    scaleSliders(value, path, children);
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
        <b>Efficiently undo negative effects of your consumption.</b> Below are marked estimates for an average british
        citizen with a disposable household income of £35000. More info in <a href="/docs">docs</a>.
      </div>
      <div class="box">{renderSliders(sliders.toJS().children)}</div>
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
            <PayPalButton items={Object.entries(donations)} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

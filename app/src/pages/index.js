import React, { useState, useMemo, useEffect } from "react";
import { fromJS } from "immutable";

import "../styles.scss";
import { Layout, Slider } from "../components";
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
            Cambodian_Children_s_Fund
            Plan_vivo
            Gold_Standard
            Founders_Pledge_Climate_change_fund
            Clean_Air_Task_Force
            WILD_Foundation
            Cool_earth
            ACE_s_Recommended_Charity_Fund
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

  function scaleChildren(tree, children, newValue) {
    if (children) {
      const childrenEntries = Object.entries(children);
      const currentSumOfChildren = childrenEntries.reduce(
        (acc, [_, { value }]) => acc + Number(value),
        0
      );
      const multiplier = newValue / currentSumOfChildren;

      for (let [_, { value, metadata, path, children }] of childrenEntries) {
        if (metadata.unit === "£") {
          const newChildValue = value === 0 ? 0.01 : value * multiplier;
          tree = insertValue(tree, path, "value", newChildValue);
          tree = scaleChildren(tree, children, newChildValue);
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

      // scale children sliders
      tree = scaleChildren(tree, children, newValue);

      // set value
      return insertValue(tree, path, "value", newValue);
    });
  }

  useEffect(() => {
    // calculate donations
    const donations = data.allCalculationsCsv.nodes.reduce(
      (acc, { slider, charities }) => {
        const obj = slider.reduce(
          (obj, child) => obj.children[child],
          sliders.toJS()
        );

        if (obj.metadata.calculateDonation === "value") {
          for (let [charity, coeff] of Object.entries(charities)) {
            acc[charity] = acc[charity] || 0; // default donation to 0
            acc["Overall montly donation"] =
              acc["Overall montly donation"] || 0; // default donation to 0
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
            acc["Overall montly donation"] += obj.value * multiplier;
            acc["Overall montly donation"] =
              Math.round(acc["Overall montly donation"] * 100) / 100;
          }
        }
        return acc;
      },
      {}
    );
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

  return (
    <Layout>
      <div class="box">{renderSliders(sliders.toJS().children)}</div>
      <div className="box">
        <table class="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Charity</th>
              <th>Donation</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(donations)
              .sort((a, b) => b[1] - a[1])
              .map(([charity, donation]) =>
                donation ? (
                  <tr>
                    <td>
                      {charity === "Overall montly donation" ? (
                        <b>Overall montly donation</b>
                      ) : (
                        charity
                      )}
                    </td>
                    <td>
                      {charity === "Overall montly donation" ? (
                        <b>{donation}</b>
                      ) : (
                        donation
                      )}
                    </td>
                  </tr>
                ) : null
              )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

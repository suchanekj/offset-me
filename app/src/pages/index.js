import React, { useState, useMemo, useEffect } from "react";
import "../styles.scss";
import { Layout, Slider } from "../components";
import { useStaticQuery } from "gatsby";

function equaliseSliders(name, value, sliders, setSliders) {
  const sum = Object.entries(sliders).reduce(
    (acc, [_, { value }]) => acc + Number(value),
    0
  );
  const currentTotalOfOtherSliders = sum - sliders[name].value;
  const whatItNeedsToBe = 100 - value;
  const multiplier = whatItNeedsToBe / currentTotalOfOtherSliders;
  const newSliders = Object.fromEntries(
    Object.entries(sliders).map(([sliderName, properties]) => [
      sliderName,
      {
        ...properties,
        value:
          sliderName === name
            ? value
            : properties.value === 0
            ? 1
            : properties.value * multiplier,
      },
    ])
  );
  setSliders(newSliders);
}

function scaleSliders(value, sliders, setSliders) {
  const sum = Object.entries(sliders).reduce(
    (acc, [_, { value }]) => acc + Number(value),
    0
  );
  const newSliders = Object.fromEntries(
    Object.entries(sliders).map(([sliderName, properties]) => [
      sliderName,
      {
        ...properties,
        value:
          sum === 0 ? value / sliders.length : (properties.value * value) / sum,
      },
    ])
  );
  setSliders(newSliders);
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
          return acc;
        },
        {}
      ),
    [data]
  );
  const [openedSliders, setOpenedSliders] = useState({});
  const [sliders, setSliders] = useState(slidersTree);
  const [donations, setDonations] = useState({}); // of the form { CharityA: 0, ...}

  useEffect(() => {
    // calculate donations
    const donations = data.allCalculationsCsv.nodes.reduce(
      (acc, { slider, charities }) => {
        const obj = slider.reduce((obj, child) => obj.children[child], sliders);

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

  function renderSliders(sliders, setSliders) {
    return Object.entries(sliders).map(([name, properties]) => {
      const { value, metadata, children } = properties;
      const isOpen = Boolean(openedSliders[name]);
      const setProperty = (property, value) =>
        setSliders({
          ...sliders,
          [name]: { ...properties, [property]: value },
        });

      return (
        <>
          <div class="columns is-vcentered">
            <div class="column form-row">
              <Slider
                name={name}
                value={value}
                setValue={(value) => {
                  if (metadata.unit === "%") {
                    equaliseSliders(name, value, sliders, setSliders);
                  } else {
                    setProperty("value", Number(value));
                    // would like to run scaleSliders(value, this_slider.children, setSliders) !!!!!!!!!!!!!!!!!!!!!!!
                    // but I don't understand what "sliders" are here and hence how to get this_slider.children

                    // and also add the value change to the parent (all the way to the top)
                    // (or have ancestors update their values as sum of their children, those are equivalent)
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
          {isOpen
            ? renderSliders(children, (sliders) =>
                setProperty("children", sliders)
              )
            : null}
        </>
      );
    });
  }

  return (
    <Layout>
      <div class="box">
        {renderSliders(sliders.children, (sliders) => {
          setSliders({ children: sliders });
        })}
      </div>
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
                    <td>{charity === "Overall montly donation" ? <b>Overall montly donation</b> : charity}</td>
                    <td>{charity === "Overall montly donation" ? <b>{donation}</b> : donation}</td>
                  </tr>
                ) : null
              )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

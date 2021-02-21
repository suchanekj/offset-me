import React, { useState, useMemo, useEffect } from "react";
import "../styles.scss";
import { Layout, Slider } from "../components";
import { useStaticQuery } from "gatsby";

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
          }
        }
      }
    }
  `);

  // create a tree of sliders from the CSV table
  const slidersTree = useMemo(
    () =>
      data.allCalculationsCsv.nodes.reduce((acc, { slider, ...values }) => {
        let obj = acc;
        for (let child of slider) {
          // create children if it doesn't yet exist
          obj.children = obj.children || {};
          // create child if it doesn't yet exist
          obj.children[child] = obj.children[child] || {};
          // get next child
          obj = obj.children[child];
        }
        obj.values = values;
        return acc;
      }, {}),
    [data]
  );

  const [openedSliders, setOpenedSliders] = useState({});
  const [sliderValues, setSliderValues] = useState(
    Object.fromEntries(
      data.allCalculationsCsv.nodes.map(({ slider }) => [
        slider[slider.length - 1],
        0,
      ])
    )
  );
  const [donationValues, setDonationValues] = useState({}); // of the form {CharityA: 0, etc.}

  // run calculations in a side-effect which updates the tree accordingly
  // run calculations and setDonations, and also equalise the percentage sliders
  // parent slider values increase all children equally
  // percentage sliders equalise and adjust the parent monetary value coefficients accordingly
  useEffect(() => {}, [sliderValues]);

  function renderSliders(sliders) {
    return Object.entries(sliders).map(([name, { values, children }]) => {
      const isOpen = Boolean(openedSliders[name]);
      return (
        <>
          <div class="columns is-vcentered">
            <div class="column">
              <Slider
                name={name}
                value={sliderValues[name]}
                setValue={(value) =>
                  setSliderValues((sliderValues) => ({
                    ...sliderValues,
                    [name]: value,
                  }))
                }
                {...values}
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
      <div class="box">{renderSliders(slidersTree.children)}</div>
    </Layout>
  );
}

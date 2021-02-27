import React, { useState, useMemo } from "react";
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
  // const [donationValues, setDonationValues] = useState({}); // of the form {CharityA: 0, etc.}

  // run calculations in a side-effect which updates the tree accordingly
  // run calculations and setDonations, and also equalise the percentage sliders
  // parent slider values increase all children equally

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
            <div class="column">
              <Slider
                name={name}
                value={value}
                setValue={(value) => {
                  if (metadata.unit === "%") {
                    equaliseSliders(name, value, sliders, setSliders);
                  } else {
                    setProperty("value", Number(value));
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
    </Layout>
  );
}

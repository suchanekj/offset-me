import React, { useState, useMemo } from "react";
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

  const [donations, setDonations] = useState(
    Object.fromEntries(
      data.allCalculationsCsv.nodes.map(({ slider }) => [
        slider[slider.length - 1],
        0,
      ])
    )
  );

  // create a tree of sliders from the CSV table
  const slidersTree = useMemo(
    () =>
      data.allCalculationsCsv.nodes.reduce((acc, { slider, ...values }) => {
        let obj = acc;
        for (let child of slider) {
          // create children if it doesn't yet exist
          obj.children = obj.children || {};
          // create child if it doesn't yet exit
          obj.children[child] = obj.children[child] || {};
          // get next child
          obj = obj.children[child];
        }
        obj.values = values;
        return acc;
      }, {}),
    [data]
  );

  function renderSliders(sliders) {
    if (sliders) {
      return Object.entries(sliders).map(([name, { values, children }]) => (
        <>
          <Slider
            name={name}
            value={donations[name]}
            setValue={(donation) =>
              setDonations((donations) => ({ ...donations, [name]: donation }))
            }
            min={values.min}
            max={values.max}
          />
          {renderSliders(children)}
        </>
      ));
    }
    return null;
  }

  return (
    <Layout>
      <div class="box">{renderSliders(slidersTree.children)}</div>
    </Layout>
  );
}

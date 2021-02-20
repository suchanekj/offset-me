import React, { useState } from "react";
import "../styles.scss";
import { Layout } from "../components";
import { useStaticQuery } from "gatsby";

export default function Index() {
  const data = useStaticQuery(graphql`
    query {
      allCalculationsCsv {
        nodes {
          items {
            Tier_1
            Tier_2
            Tier_3
            Low
            Mid
            High
            Max
            Unit
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

  const [value, setValue] = useState(0);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <Layout>
      <div class="box">
        <div class="columns is-vcentered">
          <label for="slider" class="column is-1 label">
            Carbon
          </label>
          <input
            id="slider"
            class="column slider is-fullwidth is-circle"
            type="range"
            step="1"
            min="0"
            max="100"
            value={value}
            onChange={handleChange}
          />
          <output for="slider" class="column is-1">
            {value}
          </output>
        </div>
      </div>
    </Layout>
  );
}

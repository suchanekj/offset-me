import pandas as pd
import os

df = pd.read_csv("wid/WID_Data_11012021-181326.csv", sep=";")

# files = [f for f in os.listdir("wid_all_data") if f != "WID_data_AD.csv" and "WID_data_" in f]
#
# for f in files:
#     df_f = pd.read_csv("wid_all_data/" + f, sep=";")
#     df.append(df_f)
#
df.to_csv("wid/WID_data.csv")

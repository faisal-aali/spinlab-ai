"use client";

import { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import AccountSettings from "./AccountSettings/AccountSettings";
import BillingTab from "./Billings/Billings";
import { useSession } from "next-auth/react";

const Settings = () => {
  const user = useSession().data?.user || {}
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div className="flex-1 py-8">
      <div className="p-4 flex items-center justify-between w-3/5 mb-4 h-32">
        <div className="flex gap-5 items-center">
          <div className="ml-4">
            <h2 className="font-normal">Profile Settings</h2>
            <p className="text-white text-base mt-2">Update your profile.</p>
          </div>
        </div>
      </div>
      <div className="p-8 pt-0">
        <div className="">
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="none"
            aria-label="category tabs"
            className={`!blueBackground py-2.5 rounded-lg w-fit px-3`}
            sx={{
              backgroundColor: "#001f3f",
              ".MuiTabs-flexContainer button": {
                minHeight: "40px",
                backgroundColor: "#32E10026",
                borderRadius: "6px",
                fontWeight: 500,
                fontSize: "15px",
                textTransform: "capitalize",
                padding: "10px",
                color: "#fff",
                minWidth: 0,
                height: '44px'
              },
              ".MuiTabs-flexContainer": {
                justifyContent: "center",
                gap: "10px",
              },
              ".Mui-selected": {
                backgroundColor: "#00ff00 !important",
                color: "#000 !important",
              },
            }}
          >
            <Tab label="Account" />
            {['player', 'trainer'].includes(user.role) && <Tab label="Billing" />}
          </Tabs>

          {tabIndex === 0 && <AccountSettings />}
          {tabIndex === 1 && <BillingTab />}
        </div>
      </div>
    </div>
  );
};

export default Settings;

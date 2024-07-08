"use client";

import { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import AccountSettings from "./AccountSettings/AccountSettings";
import BillingTab from "./Billings/Billings";

const Settings = () => {
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
      <div className="">
        <div className="">
          <Tabs value={tabIndex} onChange={handleTabChange} className="mb-8">
            <Tab
              label="Account"
              className={tabIndex === 0 ? "text-green-500" : ""}
            />
            <Tab
              label="Billing"
              className={tabIndex === 1 ? "text-green-500" : ""}
            />
          </Tabs>

          {tabIndex === 0 && <AccountSettings />}
          {tabIndex === 1 && <BillingTab />}
        </div>
      </div>
    </div>
  );
};

export default Settings;

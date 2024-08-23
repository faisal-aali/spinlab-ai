"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import { useApp } from "../../Context/AppContext";
import styles from "./PickYourMembership.module.css";

const PickYourMembership = ({ role, onBack, onSubmit }) => {
  const { user } = useApp();

  const [selectedPackage, setSelectedPackage] = useState("");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("monthly");

  useEffect(() => {
    console.log("User packageId: ", user?.subscription?.packageId);
    axios
      .get("/api/packages", {
        params: {
          role: role,
        },
      })
      .then((res) => setPackages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredPackages = packages.filter(
    (_package) => _package.plan === selectedTab || _package.plan === "free"
  );

  const handleSelectPackage = (packageId) => {
    setSelectedPackage(packageId);
  };

  return (
    <div className="w-full p-4 flex flex-col items-center">
      <div className="text-center mb-2">
        <h2 className="text-white text-3xl mb-2">Pick your Membership</h2>
        <p className="text-primary">1 Credit = 1 Throw</p>
      </div>

      <div className="flex justify-center mb-6">
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          indicatorColor="none"
          aria-label="category tabs"
          className={`!blueBackground py-2.5 rounded-lg w-fit px-3`}
          sx={{
            backgroundColor: "#001f3f",
            ".MuiTabs-flexContainer": {
              justifyContent: "center",
              gap: "10px",
            },
            ".MuiTab-root": {
              minHeight: "40px",
              backgroundColor: "#32E10026",
              borderRadius: "6px",
              fontWeight: 500,
              fontSize: "15px",
              textTransform: "capitalize",
              padding: "10px",
              color: "#fff !important",
              minWidth: 150,
              height: "44px",
            },
            ".Mui-selected": {
              backgroundColor: "#00ff00",
              color: "#000 !important",
            },
          }}
        >
          <Tab label="Monthly" value="monthly" />
          <Tab label="Anually" value="yearly" />
        </Tabs>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {filteredPackages.map((_package, index) => (
            <div
              key={index}
              className={`relative blueBackground flex flex-col items-center text-center cursor-pointer rounded-lg transition-all ${
                selectedPackage === _package._id
                  ? styles.selectedPlan
                  : styles.planCard
              } ${
                user?.subscription?.status === "active" &&
                user?.subscription?.packageId === _package._id
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => {
                if (
                  user?.subscription?.status === "active" &&
                  user?.subscription?.packageId === _package._id
                )
                  return;
                handleSelectPackage(_package._id);
              }}
            >
              {selectedPackage === _package._id && (
                <img
                  src={"/assets/checkmark.png"}
                  alt="Selected"
                  className="absolute top-[-1rem] right-[7rem] w-8 h-8"
                />
              )}
              <div className="py-4">
                <h3 className="text-white text-xl mb-2">{_package.name}</h3>
                {_package.plan !== "free" && (
                <p className="text-primary text-3xl font-bold mb-2">
                  ${_package.amount / 100}/{_package.plan === 'monthly' && 'mth' || _package.plan === 'yearly' && 'yr'}
                </p>)}
                <ul className="text-left text-white mt-4 px-4">
                  <li className="mb-4 flex items-center">
                    <img
                      src="/assets/checkmark.png"
                      alt="Checkmark"
                      className="w-4 h-4 mr-2"
                    />
                    {_package.plan === "free"
                      ? "Limited access to Drill Library"
                      : "Full access to Drill Library"}
                  </li>
                  {_package.plan !== "free" && (
                      <li className="mb-4 flex items-center">
                        <img
                          src="/assets/checkmark.png"
                          alt="Checkmark"
                          className="w-4 h-4 mr-2"
                        />
                        Access to member exclusive webinars
                      </li>
                  )}
                  {_package.throwsPerMonth && 
                  <li className="mb-4 flex items-center">
                    <img
                      src="/assets/checkmark.png"
                      alt="Checkmark"
                      className="w-4 h-4 mr-2"
                    />
                    {_package.throwsPerMonth} credit per month
                  </li> ||<></>}
                  <li className="mb-4 flex items-center">
                    <img
                      src="/assets/checkmark.png"
                      alt="Checkmark"
                      className="w-4 h-4 mr-2"
                    />
                    Additional credits available at ${_package.amountPerCredit / 100}/credit
                  </li>
                  {_package.plan !== "free" && (
                  <li className="mb-4 flex items-center">
                    <img
                      src="/assets/checkmark.png"
                      alt="Checkmark"
                      className="w-4 h-4 mr-2"
                    />
                    Coaching calls available
                  </li>
                )}
                </ul>
              </div>
              <div className="p-4 w-full">
                <button
                  className="mt-4 w-full bg-primary text-black font-bold py-2 rounded-lg hover:hover-shadow-light transition-all"
                  onClick={() =>
                    onSubmit(packages.find((p) => p._id === selectedPackage))
                  }
                  disabled={selectedPackage !== _package._id} // Disable if not selected
                >
                  Get started
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end mt-8">
        {onBack && (
          <button
            className="bg-white text-black font-bold px-4 py-2 rounded mr-4"
            onClick={onBack}
          >
            BACK
          </button>
        )}
      </div>
    </div>
  );
};

export default PickYourMembership;

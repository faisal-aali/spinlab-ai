const ProfilePage = () => {
  return (
    <div className="p-4">
      <div className="p-6 max-w-4xl w-full">
        <h1 className="text-white text-3xl mb-6">Your Profile</h1>
        <div
          className=" p-8 rounded-2xl flex items-start mt-12"
          style={{
            background:
              "linear-gradient(115.84deg, #32E100 -127.95%, #090F21 66.31%)",
          }}
        >
          <div className=" mr-4">
            <img
              src="assets/dummy-profile-image.png"
              alt="Faisal Ali"
              className="rounded-lg"
              style={{height:"410px"}}
            />
          </div>
          <div className="flex-1">
            <div
              className="flex justify-between items-center mb-2 rounded-lg p-4"
              style={{ background: "#32E1004D", padding: "11px 12px" }}
            >
              <h2 className="text-4xl font-normal">Faisal Ali</h2>
              <button className="bg-white text-green-600 rounded-lg p-2 focus:outline-none">
                <img src="assets/edit-icon.svg" alt="" />
              </button>
            </div>
            <p className="text-base	pb-4 pt-2 mb-2 border-b border-solid primary-border-color">
              A dedicated football coach with a passion for nurturing talent and
              fostering team spirit. Committed to instilling discipline,
              strategy, and excellence on and off the field.
            </p>
            <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
              Email: <span className="font-normal">faisalali.us@gmail.com</span> 
            </p>
            <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
              Date of Birth: <span className="text-primary">05/03/2004</span>
            </p>
            <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
              Location: <span className="text-primary">Austin, Texas</span>
            </p>
            <p className="text-base mb-2 pb-4 pt-2 border-b border-solid primary-border-color font-bold	">
              Complete Calls (Monthly): <span className="text-primary">40</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

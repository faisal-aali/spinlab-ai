import { useState } from "react";
import { Button, TextField } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const AccountSettings = () => {
  const [imageSrc, setImageSrc] = useState("https://placehold.co/100x100");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 rounded-lg bg-dark-blue">
      <h2 className="text-3xl text-white mb-6">Profile Photo</h2>
      <div className="flex items-center mb-6">
        <Avatar src={imageSrc} alt="Profile" className="w-24 h-24 rounded-full mr-4" />
        <IconButton color="primary" aria-label="upload picture" component="label">
          <input hidden accept="image/*" type="file" onChange={handleImageChange} />
          <PhotoCamera />
        </IconButton>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextField
          label="First Name"
          defaultValue="Faisal"
          variant="outlined"
          fullWidth
          InputLabelProps={{ className: "text-white" }}
          InputProps={{ className: "text-white" }}
        />
        <TextField
          label="Last Name"
          defaultValue="Ali"
          variant="outlined"
          fullWidth
          InputLabelProps={{ className: "text-white" }}
          InputProps={{ className: "text-white" }}
        />
      </div>
      <TextField
        label="Email"
        defaultValue="faisalali.uxui@gmail.com"
        variant="outlined"
        fullWidth
        className="mb-4"
        InputLabelProps={{ className: "text-white" }}
        InputProps={{ className: "text-white" }}
      />
      <div className="grid grid-cols-4 gap-4 mb-4">
        <TextField
          label="Age"
          defaultValue="40"
          variant="outlined"
          InputLabelProps={{ className: "text-white" }}
          InputProps={{ className: "text-white" }}
        />
        <TextField
          label="Height"
          defaultValue="5 feet and 7 inches"
          variant="outlined"
          InputLabelProps={{ className: "text-white" }}
          InputProps={{ className: "text-white" }}
        />
        <TextField
          label="Handedness"
          defaultValue="RIGHT / LEFT"
          variant="outlined"
          InputLabelProps={{ className: "text-white" }}
          InputProps={{ className: "text-white" }}
        />
        <TextField
          label="Weight"
          defaultValue="70 lbs"
          variant="outlined"
          InputLabelProps={{ className: "text-white" }}
          InputProps={{ className: "text-white" }}
        />
      </div>
      <h2 className="text-3xl text-white mb-6">Password</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <TextField
          label="Current Password"
          type="password"
          variant="outlined"
          InputLabelProps={{ className: "text-white" }}
          InputProps={{ className: "text-white" }}
        />
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          InputLabelProps={{ className: "text-white" }}
          InputProps={{ className: "text-white" }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          InputLabelProps={{ className: "text-white" }}
          InputProps={{ className: "text-white" }}
        />
      </div>
      <div className="flex justify-between">
        <Button variant="contained" className="bg-gray-500 text-black">
          Cancel
        </Button>
        <Button variant="contained" className="bg-green-500 text-black">
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;

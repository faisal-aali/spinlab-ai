import { Button, TextField } from "@mui/material";

const BillingTab = () => {
  return (
    <div className="p-8 rounded-lg bg-dark-blue">
      <h2 className="text-3xl text-white mb-6">Billing Details</h2>
      <div className="flex justify-between mb-6">
        <TextField label="First Name" defaultValue="John" className="w-1/2 mb-4" />
        <TextField label="Last Name" defaultValue="Clark" className="w-1/2 mb-4" />
      </div>
      <TextField label="Address" defaultValue="33042 Zboncak Isle" fullWidth className="mb-4" />
      <div className="flex justify-between mb-4">
        <TextField label="Credit Card Number" placeholder="XXXX-XXXX-XXXX-XXXX" className="w-1/2 mb-4" />
        <TextField label="CVV" placeholder="XXX" className="w-1/2 mb-4" />
      </div>
      <div className="flex justify-between mb-4">
        <TextField label="Expiry Date" placeholder="MM/YY" className="w-1/2 mb-4" />
        <TextField label="Postal Code" placeholder="000000" className="w-1/2 mb-4" />
      </div>
      <div className="flex justify-between mb-8">
        <div className="flex items-center">
          <img src="/visa.png" alt="Visa" className="mr-2" />
          <img src="/mastercard.png" alt="MasterCard" className="mr-2" />
          <img src="/mmp.png" alt="MMP" />
        </div>
        <Button variant="contained" className="bg-green-500 text-black">Pay</Button>
      </div>
    </div>
  );
};

export default BillingTab;

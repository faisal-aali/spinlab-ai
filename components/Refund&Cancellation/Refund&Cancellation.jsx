import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  maxHeight: "90vh",
  overflow: "auto",
};

const RefundCancellationPolicyDialog = ({ openModal, handleCloseModal }) => {
  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <Box sx={style} className="w-full max-w-3xl blueBackground px-16">
        <IconButton
          style={{ position: "absolute", top: 10, right: 10, color: "#fff" }}
          onClick={handleCloseModal}
        >
          <CloseIcon />
        </IconButton>
        <h2 className="text-2xl font-bold mb-8 text-center flex flex-col">
          <span>Refund and Cancellation Policy</span>
        </h2>
        <div>
          <p>
            Our Refund and Cancellation Policy is designed to provide you with a
            clear understanding of our terms and procedures. Please read the
            following guidelines carefully:
          </p>
          <h3 className="font-bold mt-4 text-primary">1. Refunds</h3>
          <p>
            We offer refunds for certain types of purchases based on specific
            criteria. To be eligible for a refund, you must request it within 30
            days of the purchase date and meet our refund conditions.
          </p>
          <h3 className="font-bold mt-4 text-primary">2. Cancellations</h3>
          <p>
            If you wish to cancel your subscription, you may do so at any time
            before the next billing cycle. Cancellations must be requested
            through our support team.
          </p>
          <h3 className="font-bold mt-4 text-primary">
            3. Contact Information
          </h3>
          <p>
            For any questions or concerns regarding our Refund and Cancellation
            Policy, please contact us at{" "}
            <a href="mailto:team@spinlabai.com" className="text-primary">
              team@spinlabai.com
            </a>
            .
          </p>
        </div>
      </Box>
    </Modal>
  );
};

export default RefundCancellationPolicyDialog;

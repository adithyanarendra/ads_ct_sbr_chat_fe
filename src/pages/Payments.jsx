import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const navigate = useNavigate();

  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    const storedPaymentId = sessionStorage.getItem("ct_sbr_payment_id");
    const storedPaymentUrl = sessionStorage.getItem("ct_sbr_payment_url");

    if (!storedPaymentId || !storedPaymentUrl) {
      navigate("/", { replace: true });
      return;
    }

    setPaymentId(storedPaymentId);
    setPaymentUrl(storedPaymentUrl);
  }, [navigate]);

  const handlePayment = () => {
    if (!paymentUrl) return;

    window.location.href = paymentUrl;
  };

  if (!paymentId || !paymentUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Preparing payment...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          File Your Tax Yourself
        </h1>

        <p className="mt-3 text-gray-600">
          Complete the one-time payment to continue with your Corporate Tax
          filing.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Self Filing</span>

            <span className="text-xl font-bold text-gray-900">AED 99</span>
          </div>

          <div className="mt-3 text-sm text-gray-500">One-time payment</div>
        </div>

        <button
          type="button"
          onClick={handlePayment}
          className="mt-8 w-full rounded-xl bg-black px-5 py-4 font-medium text-white transition hover:bg-gray-800"
        >
          Pay AED 99
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-3 w-full rounded-xl border border-gray-300 px-5 py-4 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Payments;

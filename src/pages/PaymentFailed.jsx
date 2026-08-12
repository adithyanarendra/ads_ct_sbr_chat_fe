import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [valid, setValid] = useState(false);

  useEffect(() => {
    const paymentId = searchParams.get("payment_id");
    const storedPaymentId = sessionStorage.getItem("ct_sbr_payment_id");

    if (
      paymentId &&
      storedPaymentId &&
      String(paymentId) === String(storedPaymentId)
    ) {
      setValid(true);
    }
  }, [searchParams]);

  if (!valid) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-red-600">
            Invalid Payment Session
          </h1>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-black px-6 py-3 text-white"
          >
            Return to Filing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl">
          ✕
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Payment Failed
        </h1>

        <p className="mt-3 text-gray-600">
          Your payment could not be completed. You can try again.
        </p>

        <button
          type="button"
          onClick={() => navigate("/payments")}
          className="mt-8 w-full rounded-xl bg-black py-4 text-white"
        >
          Retry Payment
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-3 w-full rounded-xl border border-gray-300 py-4 text-gray-700"
        >
          Return to Filing
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;

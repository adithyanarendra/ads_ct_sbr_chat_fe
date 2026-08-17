import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";

const PaymentSuccessful = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDemoMode = searchParams.get("demo") === "1";

  const [status, setStatus] = useState("checking");
  const [error, setError] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);
  const [reportSummary, setReportSummary] = useState(null);

  useEffect(() => {
    const storedReportUrl = sessionStorage.getItem("ct_sbr_report_url");
    const storedReportSummary = sessionStorage.getItem("ct_sbr_report_summary");

    if (storedReportUrl) {
      setReportUrl(storedReportUrl);
    }

    if (storedReportSummary) {
      try {
        setReportSummary(JSON.parse(storedReportSummary));
      } catch {
        setReportSummary(null);
      }
    }

    if (searchParams.get("demo") === "1") {
      setStatus("success");
      return;
    }

    const paymentId = searchParams.get("payment_id");

    const storedPaymentId = sessionStorage.getItem("ct_sbr_payment_id");

    /*
     * No payment ID in MamoPay return URL.
     */
    if (!paymentId) {
      setStatus("invalid");
      setError("Payment information is missing.");
      return;
    }

    /*
     * Payment ID must belong to this browser session.
     */
    if (!storedPaymentId || String(storedPaymentId) !== String(paymentId)) {
      setStatus("invalid");
      setError("This payment session is not valid.");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const checkPayment = async () => {
      try {
        const { data } = await api.get(
          `/payments/guest/status/payment/${paymentId}`,
        );

        if (cancelled) return;

        if (data.status === "SUCCESS") {
          setStatus("success");
          return;
        }

        if (data.status === "FAILED") {
          navigate(`/payments/failed?payment_id=${paymentId}`, {
            replace: true,
          });
          return;
        }

        /*
         * Webhook may arrive slightly after MamoPay redirect.
         * Poll for a short period.
         */
        attempts += 1;

        if (attempts < 10) {
          setTimeout(checkPayment, 2000);
          return;
        }

        setStatus("pending");
      } catch (err) {
        if (cancelled) return;

        setStatus("invalid");
        setError(err?.response?.data?.detail || "Unable to verify payment.");
      }
    };

    checkPayment();

    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Verifying payment...</h1>

          <p className="mt-3 text-gray-500">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Payment is still being verified
          </h1>

          <p className="mt-3 text-gray-600">
            Your payment was received, but confirmation is taking a little
            longer. Please try again shortly.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-black px-6 py-3 text-white"
          >
            Check Again
          </button>
        </div>
      </div>
    );
  }

  if (status !== "success") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-red-600">
            Payment Verification Failed
          </h1>

          <p className="mt-3 text-gray-600">
            {error || "We could not verify this payment."}
          </p>

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 sm:p-10 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            {isDemoMode ? "Instruction Video" : "Payment Successful"}
          </h1>

          <p className="mt-3 text-gray-600">
            {isDemoMode
              ? "Follow the video below before continuing your filing."
              : "Your payment has been verified successfully. Follow the video below before continuing your filing."}
          </p>
        </div>

        <video controls autoPlay className="mt-8 w-full rounded-xl border">
          <source src="/InstructionVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {reportUrl && (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
            <h2 className="text-lg font-semibold text-green-900">
              Profit & Loss Report
            </h2>

            {reportSummary && (
              <p className="mt-2 text-sm text-green-800">
                Net profit before tax: AED{" "}
                {Number(reportSummary.net_profit_before_tax || 0).toLocaleString()}
              </p>
            )}

            <a
              href={reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="Profit and Loss Report.xlsx"
              className="mt-4 inline-flex rounded-xl bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800"
            >
              Download P&L Report
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem("ct_sbr_payment_id");
            sessionStorage.removeItem("ct_sbr_payment_url");

            navigate("/");
          }}
          className="mt-8 w-full rounded-xl bg-black py-4 text-white"
        >
          Continue Filing
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessful;

export const validateWorkflowInput = (questionId, value) => {
  const input = value.trim();

  switch (questionId) {
    /**
     * UAE TRN
     * q2  -> Phase 1
     * p2q5 -> Phase 2
     */
    case "q2":
    case "p2q5": {
      if (!input) {
        return "Please enter your TRN.";
      }

      if (!/^\d+$/.test(input)) {
        return "TRN must contain numbers only.";
      }

      if (input.length !== 15) {
        return "TRN must be exactly 15 digits.";
      }

      if (!input.startsWith("100")) {
        return "A UAE TRN must start with 100.";
      }

      return null;
    }

    /**
     * Emirates ID
     */
    case "q5": {
      const digits = input.replace(/-/g, "");

      if (!/^\d+$/.test(digits)) {
        return "Emirates ID must contain numbers only.";
      }

      if (digits.length !== 15) {
        return "Emirates ID must contain 15 digits.";
      }

      if (!digits.startsWith("784")) {
        return "A valid Emirates ID starts with 784.";
      }

      return null;
    }

    default:
      return null;
  }
};

const handleWithdraw = async () => {
  try {
    setLoading(true);
    const { config } = usePrepareContractWrite({
      address: contractAddress003,
      abi: contractABI003,
      functionName: "withdraw",
    });

    const { write } = useContractWrite({
      ...config,
      onSuccess() {
        handleWithdrawSuccess();
      },
      onError(error) {
        console.error("Error during withdrawal:", error);
      },
    });

    write?.();
  } catch (error) {
    console.error("Error during withdrawal:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  // Start it off by assuming the component is still mounted
  let mounted = true;

  const loadData = async () => {
    const response = await axios.get(
      "https://api.coindesk.com/v1/bpi/historical/close.json"
    );
    // We have a response, but let's first check if component is still mounted
    if (mounted) {
      setData(response.data);
    }
  };
  loadData();

  return () => {
    // When cleanup is called, toggle the mounted variable to false
    mounted = false;
  };
}, []);

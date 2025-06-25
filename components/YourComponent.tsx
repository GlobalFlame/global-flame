useEffect(() => {
  // Move all async code into an inner function!
  async function runAsyncStuff() {
    // async logic here (your subscriptions, API calls, etc)
  }
  runAsyncStuff();

  // If you need cleanup, return a NORMAL (not async) function here
  return () => {
    // cleanup (unsubscribe, etc)
  };
}, [deps]);

import { useEffect, useState } from 'react';

export default function YourComponent() {
  useEffect(() => {
    async function runAsyncStuff() {
      // async logic here (your subscriptions, API calls, etc)
    }
    runAsyncStuff();

    return () => {
      // cleanup (unsubscribe, etc)
    };
  }, []);

  return (
    <div>
      <h2>Hello from YourComponent!</h2>
    </div>
  );
}

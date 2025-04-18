import { useState, useEffect } from 'react';
import './App.css';
import Newsapp from './Components/Newsapp';
import LoadingScreen from './Components/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <Newsapp />
      )}
    </>
  );
}

export default App;

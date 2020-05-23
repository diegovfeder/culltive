import React from 'react';

import Logo from '../component/Logo';

// TODO: Create an entire, validated for any screen, SVG Logo Component
// TODO: Load || fetch IMPORTANT data to the app from firebase(ASYNC) // save to Context?

const Splash: React.FC = () => {
  console.log("-- Splash.tsx")

  return <Logo />;
};

export default Splash;

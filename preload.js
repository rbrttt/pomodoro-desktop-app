// preload.js
// Example of exposing specific APIs securely
window.addEventListener('DOMContentLoaded', () => {
    const versionInfo = {
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron
    };
    
    console.log('App version info:', versionInfo);
  });
  
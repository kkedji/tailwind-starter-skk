import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center text-gray-800">
      <h1 className="text-4xl font-bold mb-4">🎨 Tailwind fonctionne !</h1>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded shadow-lg transition">
        C’est beau, non ?
      </button>
    </div>
  );
};

export default App;
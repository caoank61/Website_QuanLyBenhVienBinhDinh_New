import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResidenceRules = () => {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('http://localhost:3100/api/residence-rules');
        setRules(response.data);
      } catch (error) {
        console.error("There was an error fetching the rules!", error);
      }
    };

    fetchRules();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách nội quy</h1>
      {rules.length === 0 ? (
        <p>Loading...</p>
      ) : (
        rules.map(rule => (
          <div key={rule.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
            <h2 className="text-xl font-semibold mb-2">{rule.title}</h2>
            <p className="text-gray-700 whitespace-pre-line">{rule.content}</p>
            <p className="text-sm text-gray-500">Created at: {new Date(rule.created_at).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Updated at: {new Date(rule.updated_at).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ResidenceRules;

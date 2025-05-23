import { useState, useEffect } from 'react';

const VisitorForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    flatNumber: '',
    purpose: '',
    mobileNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [visitorHistory, setVisitorHistory] = useState([]);
  const [lastSubmission, setLastSubmission] = useState(null);

  useEffect(() => {
    const history = localStorage.getItem('visitorHistory');
    if (history) {
      setVisitorHistory(JSON.parse(history));
    }
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!formData.flatNumber.trim()) {
      newErrors.flatNumber = 'Flat number is required.';
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Please select a purpose.';
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Enter a valid 10-digit number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newEntry = {
      ...formData,
      timestamp: new Date().toLocaleString()
    };

    const updatedHistory = [newEntry, ...visitorHistory];
    setVisitorHistory(updatedHistory);
    localStorage.setItem('visitorHistory', JSON.stringify(updatedHistory));
    setLastSubmission(newEntry);

    setFormData({
      fullName: '',
      flatNumber: '',
      purpose: '',
      mobileNumber: ''
    });
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">
          Society Visitor Registration
        </h1>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`mt-1 px-3 py-2 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-400 focus:ring-blue-400 ${errors.fullName ? 'border-red-300' : ''}`}
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="flatNumber" className="block text-sm font-medium text-gray-700">
              Flat Number
            </label>
            <input
              type="text"
              id="flatNumber"
              name="flatNumber"
              value={formData.flatNumber}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 rounded-lg border-gray-200 shadow-sm focus:border-blue-400 focus:ring-blue-400 ${errors.flatNumber ? 'border-red-300' : ''}`}
            />
            {errors.flatNumber && <p className="mt-1 text-sm text-red-500">{errors.flatNumber}</p>}
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
              Purpose
            </label>
            <select
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 rounded-lg border-gray-200 shadow-sm focus:border-blue-400 focus:ring-blue-400 ${errors.purpose ? 'border-red-300' : ''}`}
            >
              <option value="">Select</option>
              <option value="Delivery">Delivery</option>
              <option value="Guest">Guest</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>
            {errors.purpose && <p className="mt-1 text-sm text-red-500">{errors.purpose}</p>}
          </div>

          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              maxLength="10"
              value={formData.mobileNumber}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border-gray-200 shadow-sm px-3 py-2 focus:border-blue-400 focus:ring-blue-400 ${errors.mobileNumber ? 'border-red-300' : ''}`}
            />
            {errors.mobileNumber && <p className="mt-1 text-sm text-red-500">{errors.mobileNumber}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm ">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Last Submission</h2>
            {lastSubmission ? (
              <div className="space-y-3">
                {Object.entries(lastSubmission).map(([key, value]) => (
                  <p key={key} className="flex justify-between">
                    <span className="font-medium text-gray-600">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-gray-800">{value}</span>
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No submissions yet.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm ">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Visitor History</h2>
            {visitorHistory.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {visitorHistory.map((visitor, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    {Object.entries(visitor).map(([key, value]) => (
                      <p key={key} className="flex justify-between">
                        <span className="font-medium text-gray-600">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-gray-800">{value}</span>
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No visitor history yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorForm;


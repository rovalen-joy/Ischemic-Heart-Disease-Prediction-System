// src/components/PatientDetails.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase'; 
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const PatientDetails = () => {
  const { id } = useParams(); // Retrieve patient ID from URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const docRef = doc(db, 'patients', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log('Patient Data:', docSnap.data()); 
          setPatient({ id: docSnap.id, data: docSnap.data() });
        } else {
          console.log('No such document!');
          toast.error('Patient not found.');
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
        toast.error('Failed to fetch patient details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  // **Confirmation Toast Function**
  const confirmDelete = () => {
    return new Promise((resolve) => {
      toast.custom((t) => (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 min-h-screen pointer-events-none"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white shadow-lg rounded-md p-6 border-2 border-red-500 w-11/12 max-w-md pointer-events-auto">
            <h2 className="text-xl font-semibold text-red-600 mb-3">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this patient record? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  resolve(false);
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Cancel Deletion"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resolve(true);
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Confirm Deletion"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ), {
        duration: Infinity, 
      });
    });
  };

  // **Handle Deletion from PatientDetails**
  const handleDelete = async () => {
    // Show confirmation toast and wait for user's response
    const isConfirmed = await confirmDelete();

    if (!isConfirmed) return; // User canceled the deletion

    // Proceed with deletion
    try {
      const patientDocRef = doc(db, 'patients', patient.id);
      await deleteDoc(patientDocRef);
      toast.success('Patient record deleted successfully.');
      navigate('/prediction-table'); // Redirect back to the table
    } catch (error) {
      console.error('Error deleting patient record:', error);
      toast.error('Failed to delete patient record.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-lg">No patient data available.</p>
        <button
          onClick={() => navigate('/prediction-table')}
          className="mt-3 px-8 py-3 bg-[#00717A] text-white rounded-sm hover:bg-[#005f61] focus:outline-none focus:ring-2 focus:ring-[#005f61] text-sm"
          aria-label="Go Back to Table"
        >
          Back
        </button>
      </div>
    );
  }

  const { data } = patient;

  return (
    <div className="flex flex-col items-center p-2 mt-6 relative">
      <h1 className="text-2xl font-bold mb-6 text-[#00717A]">
        Patient Details
      </h1>

      {/* Patient Details Box */}
      <div className="max-w-md w-full bg-white shadow-md rounded-md p-4 border-2 border-[#299FA8] mb-4">
        {/* Patient Information */}
        <div className="grid grid-cols-1 gap-4 text-base">
          <div>
            <strong>Patient ID:</strong> {data.patientID.toString().padStart(4, '0')}
          </div>
          <div>
            <strong>First Name:</strong> {data.firstname}
          </div>
          <div>
            <strong>Last Name:</strong> {data.lastname}
          </div>
          <div>
            <strong>Date:</strong> {format(data.timestamp.toDate(), 'MM/dd/yyyy')}
          </div>
          <div>
            <strong>Sex:</strong> {data.sex}
          </div>
          <div>
            <strong>Blood Pressure:</strong> {data.blood_pressure}
          </div>
          <div>
            <strong>Cholesterol Level:</strong> {data.cholesterol_level}
          </div>
          <div>
            <strong>Stroke History:</strong> {data.history_of_stroke}
          </div>
          <div>
            <strong>Diabetes History:</strong> {data.history_of_diabetes}
          </div>
          <div>
            <strong>Smoker:</strong> {data.smoker}
          </div>
          {data.risk_result && (
            <div>
              <strong>Risk Result:</strong> {data.risk_result}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md flex justify-between mt-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/prediction-table')}
          className="flex items-center justify-center px-8 py-2 bg-[#00717A] text-white rounded-sm hover:bg-[#005f61] focus:outline-none focus:ring-2 focus:ring-[#005f61] text-base"
          aria-label="Back"
        >
          Back
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="flex items-center justify-center px-8 py-2 bg-[#DA4B4B] text-white rounded-sm hover:bg-[#b33a3a] focus:outline-none focus:ring-2 focus:ring-[#b33a3a] text-base"
          aria-label="Delete Patient"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PatientDetails;
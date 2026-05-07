import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, User, IndianRupee, 
  Calendar, Phone, ArrowLeft, ArrowRight, Home,
  Upload, Image as ImageIcon, FileText, Camera, X
} from 'lucide-react';
import { uploadFile } from '../firebase/storage';

const AddTenant = () => {
  const { addTenant, rooms, updateRoomStatus } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', roomId: '', rent: '', dueDate: '',
    email: '', dob: '', gender: 'Male', address: '', aadhar: '', pan: '', maritalStatus: 'Single',
    occupation: '', company: '', emergencyName: '', emergencyPhone: '', previousLocation: ''
  });
  
  const [files, setFiles] = useState({ photo: null, idProof: null });
  const [previews, setPreviews] = useState({ photo: null, idProof: null });
  const [submitted, setSubmitted] = useState(false);

  const availableRooms = rooms.filter(r => r.occupied < r.capacity);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => ({ ...prev, [type]: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const clearFile = (type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    setPreviews(prev => ({ ...prev, [type]: null }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedRoom = rooms.find(r => r.id === formData.roomId);
      
      // Upload files first
      const photoUrl = await uploadFile(files.photo, 'tenants/photos');
      const idProofUrl = await uploadFile(files.idProof, 'tenants/ids');

      const tenantData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
        roomNo: selectedRoom.roomNo,
        photoUrl,
        idProofUrl,
        pending: true
      };

      await addTenant(tenantData);
      await updateRoomStatus(formData.roomId, selectedRoom.occupied + 1);

      setSubmitted(true);
      setTimeout(() => navigate('/tenants'), 2000);
    } catch (err) {
      console.error(err);
      alert("Error saving tenant. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="step-content">
            <div className="form-grid">
              <div className="form-section"><label>First Name</label><input id="firstName" required placeholder="e.g. Suraj" value={formData.firstName} onChange={handleChange} /></div>
              <div className="form-section"><label>Last Name</label><input id="lastName" required placeholder="e.g. Kumar" value={formData.lastName} onChange={handleChange} /></div>
            </div>
            <div className="form-section"><label>WhatsApp Number</label><input id="phone" type="tel" required placeholder="10-digit mobile number" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" /></div>
            <div className="form-section">
              <label>Assign Room</label>
              <select id="roomId" required value={formData.roomId} onChange={handleChange}>
                <option value="">-- Select Available Room --</option>
                {availableRooms.map(r => <option key={r.id} value={r.id}>Room {r.roomNo} ({r.capacity - r.occupied} left)</option>)}
              </select>
            </div>
            <div className="form-grid">
              <div className="form-section"><label>Monthly Rent (₹)</label><input id="rent" type="number" required placeholder="e.g. 8500" value={formData.rent} onChange={handleChange} /></div>
              <div className="form-section"><label>Due Date</label><input id="dueDate" type="date" required value={formData.dueDate} onChange={handleChange} /></div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="step-content">
            <div className="form-section"><label>Email Address</label><input id="email" type="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} /></div>
            <div className="form-grid">
              <div className="form-section"><label>Date of Birth</label><input id="dob" type="date" value={formData.dob} onChange={handleChange} /></div>
              <div className="form-section">
                <label>Gender</label>
                <div className="radio-group">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button key={g} type="button" className={formData.gender === g ? 'active' : ''} onClick={() => setFormData({...formData, gender: g})}>{g}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-section"><label>Permanent Address</label><textarea id="address" placeholder="Enter full address as per Aadhar..." value={formData.address} onChange={handleChange} rows="2" /></div>
            <div className="form-grid">
              <div className="form-section"><label>Aadhar Number</label><input id="aadhar" placeholder="12-digit Aadhar No." value={formData.aadhar} onChange={handleChange} maxLength="12" /></div>
              <div className="form-section"><label>PAN Card</label><input id="pan" placeholder="ABCDE1234F" value={formData.pan} onChange={handleChange} /></div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="step-content">
            <div className="doc-upload-grid">
              <div className="upload-box">
                <label>Passport Photo</label>
                <div className={`dropzone ${previews.photo ? 'has-file' : ''}`}>
                  {previews.photo ? (
                    <div className="preview-container">
                      <img src={previews.photo} alt="Preview" />
                      <button type="button" className="remove-btn" onClick={() => clearFile('photo')}><X size={14} /></button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <Camera size={24} />
                      <span>Take / Upload Photo</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} hidden />
                    </label>
                  )}
                </div>
              </div>

              <div className="upload-box">
                <label>Aadhar / ID Proof</label>
                <div className={`dropzone ${previews.idProof ? 'has-file' : ''}`}>
                  {previews.idProof ? (
                    <div className="preview-container">
                      <img src={previews.idProof} alt="Preview" />
                      <button type="button" className="remove-btn" onClick={() => clearFile('idProof')}><X size={14} /></button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <FileText size={24} />
                      <span>Upload ID Proof</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'idProof')} hidden />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="form-divider">Emergency & Occupation</div>
            <div className="form-grid">
              <div className="form-section"><label>Occupation</label><input id="occupation" placeholder="e.g. Software Engineer" value={formData.occupation} onChange={handleChange} /></div>
              <div className="form-section"><label>Emergency Contact</label><input id="emergencyPhone" placeholder="10-digit number" value={formData.emergencyPhone} onChange={handleChange} /></div>
            </div>
            
            <div className="terms-scroll glass">
              <p><b>Rules:</b> No smoking/alcohol. Loud music prohibited. Damage will be recovered. Valid ID is mandatory.</p>
            </div>
            <div className="checkbox-row">
              <input type="checkbox" id="agree" required />
              <label htmlFor="agree">I agree to Tulip Stays PG rules</label>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="add-tenant-page">
      <header className="page-header">
        <div className="header-top">
          <div className="header-title">
            <h1>Onboarding</h1>
            <p>Step {step} of 3</p>
          </div>
        </div>
        <div className="progress-bar-container">
          <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </header>

      <div className="form-container">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="success" className="card glass success-state" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle size={64} className="text-success" />
              <h2>Registered!</h2>
              <p>Tenant and Documents saved.</p>
            </motion.div>
          ) : (
            <div className="card glass form-card-modern">
              <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
                {renderStep()}
                <div className="step-actions">
                  {step > 1 && <button type="button" className="btn-secondary" onClick={prevStep} disabled={loading}>Back</button>}
                  {step < 3 ? (
                    <button type="button" className="btn-primary-wizard" onClick={nextStep}>Next <ArrowRight size={18} /></button>
                  ) : (
                    <button type="submit" className="btn-submit-premium" disabled={loading}>
                      {loading ? 'Uploading...' : 'Complete Onboarding'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .add-tenant-page { display: flex; flex-direction: column; gap: 1.25rem; }
        .header-top { display: flex; align-items: center; gap: 0.85rem; margin-bottom: 0.5rem; }
        .back-btn { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer; border: 1px solid var(--border); background: var(--bg-card); flex-shrink: 0; }
        .header-title h1 { font-size: 1.35rem; font-weight: 800; line-height: 1.2; }
        .header-title p { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
        .progress-bar-container { width: 100%; height: 4px; background: var(--border); border-radius: 2px; margin-top: 0.5rem; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--primary); transition: width 0.3s ease; }

        .form-card-modern { padding: 1.5rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.5rem; }
        .form-section { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
        .form-section label { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
        .form-section input, .form-section select, .form-section textarea { padding: 0.8rem 1rem; background: var(--bg-main); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-main); outline: none; font-size: 0.95rem; }
        .form-section input::placeholder { color: var(--text-muted); opacity: 0.5; font-size: 0.85rem; }

        .radio-group { display: flex; gap: 0.5rem; }
        .radio-group button { flex: 1; padding: 0.6rem; border: 1px solid var(--border); background: transparent; color: var(--text-muted); border-radius: var(--radius-sm); font-size: 0.8rem; cursor: pointer; }
        .radio-group button.active { background: var(--primary); color: white; border-color: var(--primary); }

        /* Doc Upload Grid */
        .doc-upload-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .upload-box label { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem; display: block; }
        .dropzone { height: 120px; border: 2px dashed var(--border); border-radius: var(--radius); background: var(--bg-main); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
        .dropzone.has-file { border-style: solid; border-color: var(--primary); }
        .upload-label { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--text-muted); cursor: pointer; text-align: center; padding: 1rem; }
        .upload-label span { font-size: 0.7rem; font-weight: 600; }
        
        .preview-container { width: 100%; height: 100%; position: relative; }
        .preview-container img { width: 100%; height: 100%; object-fit: cover; }
        .remove-btn { position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .form-divider { padding: 0.75rem 0; border-top: 1px solid var(--border); margin-top: 0.5rem; font-weight: 800; font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; }
        .terms-scroll { padding: 0.75rem; max-height: 80px; overflow-y: auto; font-size: 0.7rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border); }
        .checkbox-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; font-size: 0.8rem; font-weight: 600; }

        .step-actions { display: flex; gap: 1rem; margin-top: 0.5rem; }
        .btn-secondary { flex: 1; padding: 1rem; border: 1px solid var(--border); background: var(--bg-main); border-radius: var(--radius-sm); color: var(--text-main); font-weight: 600; cursor: pointer; }
        .btn-primary-wizard, .btn-submit-premium { flex: 2; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; background: var(--primary); color: white; border: none; border-radius: var(--radius-sm); font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
        .btn-submit-premium:disabled { opacity: 0.7; cursor: not-allowed; }

        @media (max-width: 768px) { .form-grid, .doc-upload-grid { grid-template-columns: 1fr; } .dropzone { height: 100px; } }
      `}</style>
    </div>
  );
};

export default AddTenant;

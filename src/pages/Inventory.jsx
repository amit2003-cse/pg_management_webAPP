import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Users, UserCheck, 
  DoorOpen, Minus, Bed, Hash, 
  ChevronRight, Info, LayoutGrid
} from 'lucide-react';
import Skeleton from '../components/Skeleton';

const Inventory = () => {
  const { rooms, addRoom, updateRoomStatus, loading } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ roomNo: '', capacity: '2' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.roomNo) return;
    await addRoom(formData);
    setFormData({ roomNo: '', capacity: '2' });
    setIsAdding(false);
  };

  const handleOccupancyChange = async (roomId, current, delta, max) => {
    const newVal = Math.min(Math.max(0, current + delta), max);
    await updateRoomStatus(roomId, newVal);
  };

  const totalBeds = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const totalOccupied = rooms.reduce((sum, r) => sum + r.occupied, 0);
  const totalVacant = totalBeds - totalOccupied;

  return (
    <div className="inventory-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Inventory</h1>
          <p>Real-time room occupancy</p>
        </div>
        <div className="header-badge glass">
          <Bed size={14} color="var(--primary)" />
          <span>{totalBeds} Total Beds</span>
        </div>
      </header>

      {/* Modern Stats Cards */}
      <div className="inventory-stats-grid">
        <motion.div 
          className="inv-stat-pill glass"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        >
          <div className="pill-icon red"><UserCheck size={20} /></div>
          <div className="pill-text">
            <span className="val">{totalOccupied}</span>
            <span className="lab">Occupied</span>
          </div>
        </motion.div>

        <motion.div 
          className="inv-stat-pill glass"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        >
          <div className="pill-icon green"><DoorOpen size={20} /></div>
          <div className="pill-text">
            <span className="val">{totalVacant}</span>
            <span className="lab">Vacant</span>
          </div>
        </motion.div>
      </div>

      <div className="action-row">
        <button className={`btn-toggle-inv ${isAdding ? 'active' : ''}`} onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Close Manager' : 'Add New Room'}
          <Plus size={20} className={isAdding ? 'rotated' : ''} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            className="card glass floating-form"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="input-group-modern">
                <div className="icon-box"><Hash size={18} /></div>
                <input 
                  type="text" required placeholder="Room Number (e.g. 101)"
                  value={formData.roomNo} onChange={e => setFormData({...formData, roomNo: e.target.value})}
                />
              </div>

              <div className="picker-container">
                <p className="picker-label">Room Capacity</p>
                <div className="capacity-grid">
                  {[1, 2, 3, 4].map(num => (
                    <button 
                      key={num} type="button"
                      className={`cap-item ${parseInt(formData.capacity) === num ? 'selected' : ''}`}
                      onClick={() => setFormData({...formData, capacity: num.toString()})}
                    >
                      <span className="num">{num}</span>
                      <span className="txt">Beds</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-save-room">
                Register Room <ChevronRight size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rooms-container">
        <div className="section-header">
          <LayoutGrid size={16} />
          <span>Room Directory</span>
        </div>
        
        <div className="rooms-masonry">
          {loading ? (
            <Skeleton height="160px" />
          ) : rooms.length === 0 ? (
            <div className="empty-rooms glass">
              <Info size={40} />
              <p>No rooms added to the map yet.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {rooms.map((room) => (
                <motion.div 
                  layout key={room.id} className="modern-room-card glass"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                >
                  <div className="room-top">
                    <div className="room-meta">
                      <h3>Room {room.roomNo}</h3>
                      <span className="tag">{room.capacity} Seater</span>
                    </div>
                    <div className={`status-dot ${room.occupied === room.capacity ? 'full' : 'avail'}`}></div>
                  </div>

                  <div className="beds-layout">
                    {Array.from({ length: room.capacity }).map((_, i) => (
                      <div key={i} className={`bed-box ${i < room.occupied ? 'active' : ''}`}>
                        <Bed size={16} />
                      </div>
                    ))}
                  </div>

                  <div className="room-footer">
                    <div className="occ-stepper">
                      <button onClick={() => handleOccupancyChange(room.id, room.occupied, -1, room.capacity)}><Minus size={14} /></button>
                      <span className="val">{room.occupied} / {room.capacity}</span>
                      <button onClick={() => handleOccupancyChange(room.id, room.occupied, 1, room.capacity)}><Plus size={14} /></button>
                    </div>
                    <div className="percentage">
                      {Math.round((room.occupied / room.capacity) * 100)}% Full
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <style>{`
        .inventory-page { display: flex; flex-direction: column; gap: 1.5rem; padding-bottom: 50px; }
        .header-badge { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: var(--radius-xl); font-weight: 700; font-size: 0.8rem; }
        
        .inventory-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .inv-stat-pill { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border-radius: var(--radius-md); }
        .pill-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .pill-icon.red { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
        .pill-icon.green { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .pill-text { display: flex; flex-direction: column; }
        .pill-text .val { font-size: 1.25rem; font-weight: 800; }
        .pill-text .lab { font-size: 0.7rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

        .btn-toggle-inv { 
          display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; 
          background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-xl); 
          color: var(--text-main); font-weight: 700; font-size: 0.9rem; margin: 0 auto;
          box-shadow: var(--shadow);
        }
        .btn-toggle-inv.active { background: var(--danger); color: white; border-color: var(--danger); }
        .btn-toggle-inv .rotated { transform: rotate(45deg); }

        .floating-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .input-group-modern { display: flex; align-items: center; background: var(--bg-main); border: 1px solid var(--border); border-radius: var(--radius); padding: 0 1rem; margin-bottom: 1rem; }
        .input-group-modern .icon-box { color: var(--text-muted); margin-right: 0.75rem; }
        .input-group-modern input { flex: 1; padding: 1rem 0; background: transparent; border: none; color: var(--text-main); font-weight: 600; outline: none; }

        .picker-container { margin-bottom: 1.25rem; }
        .picker-label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.75rem; }
        .capacity-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
        .cap-item { 
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 0.75rem; border-radius: var(--radius); border: 1px solid var(--border);
          background: var(--bg-card); color: var(--text-muted); transition: var(--transition);
        }
        .cap-item.selected { background: var(--primary); color: white; border-color: var(--primary); transform: scale(1.05); }
        .cap-item .num { font-size: 1.1rem; font-weight: 800; }
        .cap-item .txt { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; }

        .btn-save-room { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; background: linear-gradient(135deg, var(--primary), var(--primary-hover)); color: white; border: none; border-radius: var(--radius); font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); }

        .section-header { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 1rem; }
        .rooms-masonry { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
        .modern-room-card { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .room-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .room-meta h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 0.25rem; }
        .room-meta .tag { font-size: 0.65rem; font-weight: 700; color: var(--primary); background: var(--primary-light); padding: 2px 8px; border-radius: 4px; }
        .status-dot { width: 10px; height: 10px; border-radius: 50%; }
        .status-dot.avail { background: var(--success); box-shadow: 0 0 10px var(--success); }
        .status-dot.full { background: var(--danger); box-shadow: 0 0 10px var(--danger); }

        .beds-layout { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .bed-box { 
          width: 44px; height: 44px; border-radius: 12px; background: var(--bg-main); 
          color: var(--text-muted); display: flex; align-items: center; justify-content: center; 
          border: 1px dashed var(--border); transition: var(--transition);
        }
        .bed-box.active { background: var(--primary); color: white; border-style: solid; border-color: var(--primary); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }

        .room-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border); }
        .occ-stepper { display: flex; align-items: center; gap: 0.75rem; background: var(--bg-main); padding: 4px 10px; border-radius: 100px; }
        .occ-stepper button { background: transparent; border: none; color: var(--text-main); cursor: pointer; padding: 4px; }
        .occ-stepper .val { font-size: 0.85rem; font-weight: 800; min-width: 45px; text-align: center; }
        .percentage { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); }

        .empty-rooms { padding: 3rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--text-muted); }

        @media (max-width: 768px) {
          .inventory-stats-grid { grid-template-columns: 1fr; }
          .rooms-masonry { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Inventory;

import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc,
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

const roomsCollection = collection(db, "rooms");

// Subscribe to real-time rooms
export const subscribeToRooms = (callback) => {
  const q = query(roomsCollection, orderBy("roomNo", "asc"));
  return onSnapshot(q, (snapshot) => {
    const rooms = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(rooms);
  });
};

// Add new room
export const addNewRoom = async (room) => {
  return await addDoc(roomsCollection, {
    ...room,
    createdAt: serverTimestamp()
  });
};

// Update bed status in a room
export const updateRoomOccupancy = async (roomId, occupiedCount) => {
  const roomRef = doc(db, "rooms", roomId);
  return await updateDoc(roomRef, { occupied: occupiedCount });
};

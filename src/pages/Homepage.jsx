import SideBar from '../components/SideBar';
import GroupChat from '../components/GroupChat';
import { useEffect, useState} from 'react';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const Homepage = () => {
  const [participants, setParticipants] = useState([]);
  const getParticipants = async () => {
    try {
        console.log('participants in groupchat');
        const queryParticipants = await getDocs(collection(db, "participants"));
        const fetchedParticipants = queryParticipants.docs.map((participant) => ({
            ...participant.data(),
            id: participant.id
          }));
        setParticipants(fetchedParticipants);
        console.log(fetchedParticipants, 'participants');
    } catch (e) {
        console.error("Error fetching participants: ", e);
    };
  }
  useEffect(() => {
    getParticipants();
  }, [] )
  return (
    <div className="Flex">
      <SideBar participants={participants} setParticipants={setParticipants}/>
      <div className='Vertical-flex' style={{width: '85%'}}>
        <GroupChat participants={participants}/>
      </div>
    </div>
  );
}

export default Homepage;

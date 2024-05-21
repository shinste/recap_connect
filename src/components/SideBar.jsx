import Avatar from '@mui/material/Avatar';
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '@mui/material';
import Add from '../images/add.png';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const useStyles = makeStyles(() => ({
    roundedInput: {
      '& .MuiInputBase-input': {
        borderRadius: 20,
        padding: '4px 10px 8px',
      },
      '& .MuiOutlinedInput-root': {
        borderRadius: 20,
        width: '100%',
        '& fieldset': {
            borderColor: '#EF6880',
          },
      },
    },
  }));

const SideBar = ({ participants, setParticipants }) => {
    const classes = useStyles();
    const friends = [
        { user: 'Lisa Roy', avatar: 'L'},
        { user: 'Jamie Taylor', avatar: 'J'},
        { user: 'Jason Brown', avatar: 'J'},
        { user: 'Amy Frost', avatar: 'F'}
    ]
    const [filtered, setFiltered] = useState(friends);

    const handleSearch = (event) => {
        const new_query = friends.filter((value) => {return value.user.toLowerCase().includes(event.target.value.toLowerCase())});
        setFiltered(new_query);
    }

    const handleAdd = async(username) => {
        try {
            console.log('adding user to groupchat');
            console.log(participants)
            const participantRef = await addDoc(collection(db, "participants"), {
                user: username
            });
            const updatedParticipants = participants.concat([{ id: participantRef.id, user: username}]);
            setParticipants(updatedParticipants);
        } catch (e) {
            console.error("Error adding participant: ", e);
        } 
    }

    const inGroup = (name) => {
        return participants.some(participant => participant.user === name);
    };

    const handleRemove = async (name) => {
        try {
            const beforeRemove = await getDocs(collection(db, 'participants'));
            beforeRemove.forEach(async (doc) => {
                if (doc.data().user === name) {
                    await deleteDoc(doc.ref);
                  }
            });
            const newParticipants = participants.filter((participant) => participant.user !== name);
            setParticipants(newParticipants);
            console.log('User successfully removed from group');
            console.log(inGroup(name));
        } catch (error) {
            console.error('Error deleting documents:', error);
        }
    }

    return (
        <div className="Bar-dimensions">
            <div className="Friends Vertical-flex">
                <div className="Flex my-3 mb-4">
                    <Avatar sx={{width: 60, height: 60, marginRight: '20px'}}> M </Avatar>
                    <p className='Vertical-align Bold'>Me</p>
                </div>
                <div className='Search-width'>
                    <TextField
                        className={classes.roundedInput}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                            <SearchIcon style={{marginTop: 0, marginBottom: 2, color: '#898989'}}/>
                            ),
                        }}
                        onChange={handleSearch}
                    />
                </div>
                <div className='m-3'>
                    {filtered.map((person) => {
                        return (
                            <div key={person.id} className='Flex mb-3 User'>
                                <Avatar sx={{height: '30px', width: '30px', marginRight: '15px'}}>{person.avatar}</Avatar>
                                <p className='Vertical-align Name Bold'>{person.user}</p>
                                <div className='Add-div'>
                                    {!inGroup(person.user) ? 
                                        <Button onClick={() => handleAdd(person.user)} sx={{backgroundColor:'#FFECEF'}} variant="contained">
                                            <img style={{height: '15px', marginRight: '3px'}} src={Add}/>
                                            <p className='m-0'>Add</p>
                                        </Button>
                                    :
                                        <Button onClick={() => handleRemove(person.user)}>
                                            <p className='m-0'>Remove</p>
                                        </Button>
                                    }
                                </div>
                                
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </div>
    );
};

export default SideBar;
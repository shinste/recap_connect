import { Avatar, Button} from "@mui/material";
import Recap from '../images/recap_connect.png';
import Search from '../images/search.png';
import Heart from '../images/heart.png';
import Bell from '../images/bell.png';
import Send from '../images/send.png';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useRef, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, getFirestore} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from "../firebase";
import Response from '../functions/Response';
import Popup from 'reactjs-popup';
import PaperClip from '../images/paperclip.png';
import Detail from '../images/detail.png';
import Photos from './Photos';


const useStyles = makeStyles((theme) => ({
    roundedInput: {
      '& .MuiInputBase-input': {
        borderRadius: 25,
        padding: '3px 10px 5px 15px',
        marginBottom: '3px',
        backgroundColor: '#FFFFFF',
        height: '40px',
        width: '100%',
      },
      '& .MuiOutlinedInput-root': {
        borderRadius: 25,
        width: '70vw',
        '& fieldset': {
            borderColor: '#FFDCE2',
        },
        '&:hover fieldset' : {
            borderColor: '#FFDCE2'
        },
        '&:focus-within fieldset' : {
            borderColor: '#FFDCE2'
        }
      },
      '& .MuiInputLabel-root': {
      },
    },
  }));

const GroupChat = ({participants}) => {
    const classes = useStyles();
    const [conversation, setConversation] = useState([]);
    const [currChat, setCurrChat] = useState('');
    const scrollableRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [captions, setCaptions] = useState([]);
    const [downUrls, setDownUrls] = useState([]);
    const [participantNames, setParticipantNames] = useState([]);
    const [details, setDetails] = useState(false);

    const getFromDB = async () => {
        try {
            console.log('pull');
            const queryMessages = await getDocs(query(collection(db, "messages"), orderBy("timestamp", "asc")));
            const fetchedMessages = queryMessages.docs.map((message) => ({ ...message.data(), id: message.id }));
            setConversation(fetchedMessages);
            console.log(fetchedMessages);
        } catch (e) {
            console.error("Error fetching todos: ", e);
        };
    }
    const handleSend = async (message) => {
        if (currChat !== '') {
            setCurrChat('');
            try {
                console.log('loading');
                const messageRef = await addDoc(collection(db, "messages"), {
                text: message,
                user: 'Me',
                timestamp: new Date()
                });
                const newConversation = conversation.concat([{ id: messageRef.id, text: message, user: 'Me' }]);
                setConversation(newConversation);
                if (selectedFiles.length === 0){
                    reply(newConversation);
                };
            } catch (e) {
                console.error("Error adding message: ", e);
            } 
        }  
        if (selectedFiles.length !== 0) {
            displayImage();
        };
    }

    const uploadFile = async (file) => {
        try {
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
    
            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                    },
                    reject,
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadURL) => {
                                downUrls.push(downloadURL);
                                console.log('upload complete?', downUrls, downloadURL);
                                resolve();
                            })
                            .catch(reject);
                    }
                );
            });
            
        } catch (error) {
            throw error;
        }
    };

    const reply = async (newConversation) => {
        const responseMessage = Response(participantNames);
        console.log(responseMessage, participantNames);
            const responseRef = await addDoc(collection(db, "messages"), {
            text: responseMessage[0],
            user: responseMessage[1],
            timestamp: new Date()
            });
            setConversation(newConversation.concat([{ id: responseRef.id, text: responseMessage[0], user: responseMessage[1] }]));
    }

    const displayImage = async () => {
        try {
            console.log(downUrls, 'displayImage checking url object');
            console.log(captions);
            const imageRef = await addDoc(collection(db, "messages"), {
                text: captions,
                user: 'Me',
                url: downUrls,
                timestamp: new Date()
            });
            const newConversation = conversation.concat([{ id: imageRef.id, text: captions, user: 'Me', url: downUrls}])
            setConversation(newConversation);
            reply(newConversation);
        } catch (e) {
            console.error("Error adding message: ", e);
        } 
        setDownUrls([]);
        setCaptions([]);
        setSelectedFiles([]);
    };

    const deleteMessagesCollection = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'messages'));
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            setConversation([]);
            console.log('All documents in "messages" collection deleted successfully.');
        } catch (error) {
            console.error('Error deleting documents:', error);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFiles([...selectedFiles, file]);
            setCaptions([...captions, ""]);
            uploadFile(file);
        };
      };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleRemove = (target) => {
        setSelectedFiles(selectedFiles.filter((_, index) => index !== target));
        setCaptions(captions.filter((_, index) => index !== target));
        setDownUrls(downUrls.filter((_, index) => index !== target));
        console.log(selectedFiles, captions, downUrls, 'deleting things');
    }

    const handleCaptions = (e, index) => {
        const clonedCaption = [...captions];
        clonedCaption[index] = e.target.value;
        setCaptions(clonedCaption);
        console.log(captions);
    }

    useEffect(() => {
        if (scrollableRef.current) {
            scrollableRef.current.scrollIntoView()
        }
    }, [conversation]);

    useEffect(() => {
        getFromDB();
    }, [])

    useEffect(() => {
        if (participants) {
            const newNames = participants.map(obj => obj.user);
            setParticipantNames(newNames);
        }
        
    }, [participants])


    return (
        <div className="Vertical-flex View-height">
            <div className="Vertical-flex px-5">
                <div id="Group-bar" className="Vertical-align">
                    <div className="Flex Vertical-align">
                        <Avatar id="Group-avatar">F</Avatar>
                        <p className="Vertical-align Bold">Friends Forever!</p>
                    </div>
                    <img id="Logo" src={Recap}/>
                    <div id="Buttons">
                        <Button sx={{minWidth: '30px'}}>
                            <img src={Search}/>
                        </Button>
                        <Button sx={{ minWidth: '30px'}}>
                            <img src={Heart} />
                        </Button>
                        <Button onClick={() => setDetails(!details)} sx={{ minWidth: '30px'}}>
                            <img src={Detail} />
                        </Button>
                    </div>
                </div>
                <hr className='Line'/>
            </div>
            {details ? 
                <Photos conversation={conversation} />
            :
                <div>
                    <div id="Chat-box">
                {conversation.map((message) => {
                    if (message.url) {
                        return(
                            <div id="Mymessage">
                                {message.url.map((url, index) => {
                                    return (
                                        <div className="Image-content">
                                            <div className="Vertical-flex">
                                                <img id="Image" src={url} style={{width: '200px', height: 'auto'}}/>
                                                {message.text[index] && 
                                                <div id='Caption-div'>
                                                    <p className="P-message caption-div">{message.text[index]}</p>
                                                </div>
                                                }
                                                
                                            </div>
                                        </div>
                                    );
                                })}
                                <Avatar className="Avatar">L</Avatar>
                            </div>
                        );
                    }
                    else if (message.user === 'Me') {
                        return (
                            <div id="Mymessage">
                                <div id="Messagecontent"style={{borderRadius: '10px 10px 0px 10px'}}>
                                    <p className="P-message" ref={scrollableRef}>{message.text}</p> 
                                </div>
                                <Avatar className="Avatar">L</Avatar>
                            </div>
                        );
                    }else {
                        return (
                            <div className="Flex mb-4">
                                <Avatar className="Response-avatar">{message.user[0]}</Avatar>
                                <div className="Messagecontent" style={{borderRadius: '10px 10px 10px 0px', backgroundColor: '#EF6880'}}>
                                    <p className="P-message" ref={scrollableRef} >{message.text}</p> 
                                </div>
                            </div>
                        );
                    }
                })}
                {conversation.length !== 0 && <Button onClick={deleteMessagesCollection} sx={{backgroundColor: '#FFECEF', color: '#FFFFFF'}}><p>Delete All Chat</p></Button>}  
                <div id="imageContainer">
                </div>              
            </div>
            <div id="Chat-insert">
                <div id='Chat-text'>
                    <div id='File-display'>
                        Added Files:&nbsp;  
                        {selectedFiles.map((file, index) => {
                            return(
                                <div key={index}>
                                    {file.name}&nbsp;
                                </div>
                            );
                        })}
                    </div>
                    <div style={{marginTop: 'auto', marginBottom: 'auto'}}>
                        <TextField
                            className={classes.roundedInput}
                            label={'Write something...'}
                            variant="outlined"
                            onKeyDown={(event) => {if (event.key === 'Enter' && event.target.value !== '') {
                                                        handleSend(event.target.value);
                                       }}}
                            value={currChat}
                            onChange={(event) => setCurrChat(event.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                        <Popup trigger={<Button><img src={PaperClip} /></Button>} position="left">
                                            <div id="Pop-up"className="Flex">
                                                {selectedFiles.map((file, index) => {
                                                    return (
                                                        <div id="File-hold"key={index}>
                                                            <div className="Flex"> 
                                                                {file.name}
                                                                <Button onClick={() => handleRemove(index, file.name)} sx={{width: '30px', height: '30px', marginLeft: 'auto', color: 'red'}}>X</Button>
                                                            </div>
                                                            <TextField value={captions[index]} label="Caption your pic!" onChange={(e) => {handleCaptions(e, index)}
                                                            }/>
                                                        </div>
                                                    );
                                                })}
                                                <Button onClick={handleButtonClick}><p>Add a photo!</p></Button>
                                            </div>
                                        </Popup>
                                    </div>
                                ),
                            }}
                        />
                    </div>
                    <Button onClick={() => handleSend(currChat)} className="Vertical-align" sx={{backgroundColor: '#EF6880', borderRadius: 50, height: '70px', width: '70px', marginLeft: '30px', marginTop: 'auto', marginBottom: 'auto'}}>
                        <img src={Send} id="Send-button"/>
                    </Button>
                </div>
            </div>
                </div>
                }
            
        </div>
    );
}

export default GroupChat;
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import SideBar from './components/SideBar';
import GroupChat from './components/GroupChat';

function App() {
  return (
    <div className="Flex">
      <SideBar />
      <div className='Vertical-flex' style={{width: '85%'}}>
        <GroupChat />
      </div>
    </div>
  );
}

export default App;

import {BrowserRouter as Router,Link,Routes,Route} from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Home from './pages/Home'
import './App.css';
import { Container } from '@mui/material';
ChartJS.register(ArcElement, Tooltip, Legend);
function App() {
  return (
    <Router>
      <Container maxWidth = "md">
        <Routes>
          <Route exact path = "/" element = {<Home/>}/>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

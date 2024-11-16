import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/App/Navbar';
import Home from './pages/Home';
import MostRated from './pages/MostRated';
import Popular from './pages/Popular';
import Watchlist from './pages/Watchlist';
import MoviePage from './pages/MoviePage';

const App = () => {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/popular" element={<Popular />} />
                    <Route path="/most-rated" element={<MostRated />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                    <Route path="/movie/:id" element={<MoviePage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

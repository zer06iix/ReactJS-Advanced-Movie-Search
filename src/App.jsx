import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/AppComponents/Navbar';
import Home from './pages/Home';
import MostRated from './pages/MostRated';
import Popular from './pages/Popular';
import Watchlist from './pages/Watchlist';
import MoviePage from './pages/MoviePage';
import ResultsPage from './pages/ResultsPage';
import SeriesPage from './pages/SeriesPage';

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
                    <Route path="/series/:id" element={<SeriesPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

import useMovieStore from "../../../store/movieStore"
import CastItem from "./CastItem"

export default function CastScroller() {

    const { credits } = useMovieStore()

    return (
        <div className="cast-scroller-container">
            <div className="cast-scroller">
                {credits && credits.cast && credits.cast.length > 0 ? (
                    credits.cast.map((member) => (
                        <CastItem member={member} key={member.id}/>
                    ))
                ) : (
                    <p>No cast information available.</p>
                )}
            </div>
        </div>
    )
}
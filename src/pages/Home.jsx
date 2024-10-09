import BackwardIcon from "../components/buttons/BackwardButton";
import ForwardIcon from "../components/buttons/ForwardButton";

export default function Home() {

    return (
        <>
            <BackwardIcon 
                className="active:-translate-x-1.5 transition duration-150 fixed left-0 top-1/2 transform -translate-y-1/2 ml-4 mt-4"
            />            
            
            <ForwardIcon 
                className="active:translate-x-1.5 transition duration-150 fixed right-0 top-1/2 transform -translate-y-1/2 mr-4 mt-4"
            />
        </>
    )
}
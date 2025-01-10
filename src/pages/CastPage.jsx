/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useFetchStore from "../stores/fetchStore";
// import useCastStore from "../stores/castStore";


export default function CastPage() {
    const { id: castId } = useParams();
    const { fetchCastDetails, fetchCastCredits } = useFetchStore();
    // const { cast, castCredits } = useCastStore();

    const {
        data: castDetailsData,
        isLoading: castDetailsLoading,
        error: castDetailsError,
    } = useQuery({
        queryKey: ['castDetails', castId],
        queryFn: () => fetchCastDetails(castId),
        enabled: !!castId
    });

    const {
        data: castCreditsData,
        isLoading: castCreditsLoading,
        error: castCreditsError,
    } = useQuery({
        queryKey: ['castCredits', castId],
        queryFn: () => fetchCastCredits(castId),
        enabled: !!castId
    });


    return <div className="text-white flex justify-center item-center">test</div>;
}